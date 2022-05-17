import type { RequestHandler } from '@sveltejs/kit';
import strava from 'strava-v3';
import dotenv from 'dotenv';
import { flatten, pluck, sortBy } from 'ramda';
import { getAthletes, updateAthlete } from './_db';

dotenv.config();

const startDate = new Date('2022-05-01');
const endDate = new Date('2022-09-22');

export const get: RequestHandler = async ({ request }) => {
  const athletes = getAthletes();

  const athleteDataPromises: Promise<AthleteData>[] = athletes.map(async (athlete) => {
    const activities: Activity[] = await getActivities(athlete);
    const sortedActivities = sortBy((a) => a.start_date_local, activities);

    const aggregatedActivities = sortedActivities.reduce<AggregatedActivity[]>((acc, activity) => {
      const { name, start_date, distance, elapsed_time, average_speed, max_speed } = activity;
      const previousDistance = acc[acc.length - 1]?.total_distance || 0;

      // Convert to whole numbers to avoid floating point errors
      const total_distance = (previousDistance * 100 + activity.distance * 100) / 100;

      acc.push({
        name,
        date: Date.parse(start_date),
        distance,
        elapsed_time,
        average_speed,
        max_speed,
        total_distance,
      });

      return acc;
    }, []);

    const cumulativeData: CumulativeDataPoint[] = aggregatedActivities.map(
      ({ date, total_distance }) => ({
        date,
        total_distance,
      }),
    );
    cumulativeData.unshift({ date: startDate.getTime(), total_distance: 0 });

    const { id, firstname, lastname, profile } = athlete;
    return {
      id,
      firstname,
      lastname,
      profile,
      cumulativeData,
    };
  });

  const athleteData = await Promise.all(athleteDataPromises);
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
