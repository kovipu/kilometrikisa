import type { RequestHandler } from '@sveltejs/kit';
import strava from 'strava-v3';
import dotenv from 'dotenv';
import { flatten, last, pluck, sortBy, uniq } from 'ramda';
import { getAthletes, updateAthlete } from './_db';

dotenv.config();

const startDate = new Date('2022-05-01');
const endDate = new Date('2022-09-22');

type AggregatedData = {
  aggregatedActivities: AggregatedActivity[];
  totalDistance: number;
  totalRideTime: number;
  maxSpeed: number;
}

export const get: RequestHandler = async ({ request }) => {
  const athletes = getAthletes();

  const athleteActivities = await Promise.all(athletes.map(athlete => getActivities(athlete)));

  const athleteData: AthleteData[] = athleteActivities.map((activities, athleteIdx) => {
    const sortedActivities = sortBy((a) => a.start_date_local, activities);

    const { aggregatedActivities, totalDistance, totalRideTime, maxSpeed } = aggregateData(sortedActivities);

    const totalRideDays = uniq(pluck('start_date', activities)).length;
    const activityData = {
      totalDistance,
      totalRideTime,
      maxSpeed,
      totalRideDays
    }

    const cumulativeData: CumulativeDataPoint[] = aggregatedActivities.map(
      ({ date, total_distance }) => ({
        date,
        total_distance,
      }),
    );
    cumulativeData.unshift({ date: startDate.getTime(), total_distance: 0 });

    const { id, firstname, lastname, profile } = athletes[athleteIdx];
    return {
      id,
      firstname,
      lastname,
      profile,
      cumulativeData,
      activityData
    };
  });

  const flatData = flatten(pluck('cumulativeData', athleteData));

  return {
    status: 200,
    body: {
      athleteData,
      flatData,
    },
  };
};

const after = startDate.getTime() / 1000;

const getActivities = async ({
  access_token,
  refresh_token,
  firstname,
  ...rest
}: AthleteSession): Promise<Activity[]> => {
  try {
    return await strava.athlete.listActivities({ access_token, after, per_page: 200 });
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
  return data.reduce<AggregatedData>((acc, activity) => {
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
  }, {
    aggregatedActivities: [],
    totalDistance: 0,
    totalRideTime: 0,
    maxSpeed: 0,
  });
}
