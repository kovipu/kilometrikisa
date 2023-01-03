import type { PageServerLoad } from './$types';
import strava from 'strava-v3';
import dotenv from 'dotenv';
import { flatten, last, mean, pluck, sortBy, uniqBy } from 'ramda';
import { getAthletes, updateAthlete } from '$lib/_db';
import { format } from 'date-fns';
import { startDateTime, endDateTime } from '$lib/constants';
import type { Cookies } from '@sveltejs/kit';

dotenv.config();

type AggregatedData = {
  aggregatedActivities: AggregatedActivity[];
  totalDistance: number;
  totalRideTime: number;
  maxSpeed: number;
};

export const load: PageServerLoad = async ({ cookies }) => {
  const session = getSessionFromCookies(cookies);
  if (session) {
    updateAthlete(session);
  }

  const athletes = getAthletes();

  const athleteActivities = await Promise.all(athletes.map((athlete) => getActivities(athlete)));

  const athleteData: AthleteData[] = athleteActivities.map((activities, athleteIdx) => {
    const athleteRides = activities.filter(({ type }) => type === 'Ride' || type === 'EBikeRide');
    const sortedActivities = sortBy((a) => a.start_date_local, athleteRides);

    const { aggregatedActivities, totalDistance, totalRideTime, maxSpeed } =
      aggregateData(sortedActivities);

    const totalRideDays = uniqBy(
      (date: string) => format(new Date(date), 'yyyy-MM-dd'),
      pluck('start_date', athleteRides),
    ).length;
    const averageRideDistance = totalDistance / aggregatedActivities.length;
    const averageRideLength = mean(pluck('elapsedTime', aggregatedActivities));
    const averageSpeed = mean(pluck('averageSpeed', aggregatedActivities));

    const activityData = {
      totalDistance,
      totalRideTime,
      totalRideDays,
      averageRideDistance,
      averageRideLength,
      averageSpeed,
      maxSpeed,
    };

    const cumulativeData: CumulativeDataPoint[] = aggregatedActivities.map(
      ({ date, totalDistance }) => ({
        date,
        totalDistance,
      }),
    );
    cumulativeData.unshift({ date: startDateTime.getTime(), totalDistance: 0 });

    const { id, firstname, lastname, profile } = athletes[athleteIdx];
    return {
      id,
      firstname,
      lastname,
      profile,
      cumulativeData,
      activityData,
    };
  });

  const flatData = flatten(pluck('cumulativeData', athleteData));

  const currentDistance = session
    ? athleteData.find((athlete) => athlete.id === session.id)?.activityData.totalDistance
    : null;

  return {
    athleteData,
    flatData,
    currentDistance,
  };
};

const getSessionFromCookies = (cookies: Cookies): AthleteSession | null => {
  const session = cookies.get('session')

  if (!session) {
    return null;
  }

  return session ? JSON.parse(session) : null;
};

const getActivities = async ({
  access_token,
  refresh_token,
  firstname,
  ...rest
}: AthleteSession): Promise<Activity[]> => {
  const after = startDateTime.getTime() / 1000;
  const before = endDateTime.getTime() / 1000;
  try {
    return await strava.athlete.listActivities({ access_token, after, before, per_page: 200 });
  } catch (error) {
    // Assume access_token is expired and refresh it
    try {
      const response = await strava.oauth.refreshToken(refresh_token);
      updateAthlete({
        ...rest,
        firstname,
        access_token: response.access_token,
        refresh_token: response.refresh_token,
      });
      return strava.athlete.listActivities({
        access_token: response.access_token,
        after,
        per_page: 200,
      });
    } catch (error) {
      console.error('unrecoverable error fetching activities for athlete: ' + firstname, error);
      return [];
    }
  }
};

const aggregateData = (data: Activity[]): AggregatedData => {
  return data.reduce<AggregatedData>(
    (acc, activity) => {
      const { name, start_date, distance, elapsed_time, average_speed, max_speed } = activity;
      const previousDistance = last(acc.aggregatedActivities)?.totalDistance || 0;

      // Convert to whole numbers to avoid floating point errors
      const totalDistance = (previousDistance * 100 + activity.distance * 100) / 100;

      acc.aggregatedActivities.push({
        name,
        date: Date.parse(start_date),
        distance,
        elapsedTime: elapsed_time,
        averageSpeed: average_speed,
        totalDistance,
      });

      acc.totalDistance = totalDistance;
      acc.totalRideTime += elapsed_time;
      acc.maxSpeed = Math.max(acc.maxSpeed, max_speed);

      return acc;
    },
    {
      aggregatedActivities: [],
      totalDistance: 0,
      totalRideTime: 0,
      maxSpeed: 0,
    },
  );
};
