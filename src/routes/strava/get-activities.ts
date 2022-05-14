import type { RequestHandler } from '@sveltejs/kit';
import strava from 'strava-v3';
import dotenv from 'dotenv';
import cookie from 'cookie';
import { sortBy } from 'ramda';

dotenv.config();

type Activity = {
	start_date_local: string;
	distance: number;
};

export const get: RequestHandler = async ({ request }) => {
	const cookies = request.headers.get('cookie');

	if (!cookies) {
		return {
			status: 400,
			body: 'Strava access code not found'
		};
	}

	const { access_token } = cookie.parse(cookies);

	if (!access_token) {
		return {
			status: 400,
			body: 'Strava access code not found'
		};
	}

	const after = Date.parse('2022-05-01T00:00:00Z') / 1000;

	const activities: Activity[] = await strava.athlete.listActivities({
		access_token,
		after,
		per_page: 200
	});
	const sortedActivities = sortBy((a) => a.start_date_local, activities);

	const cumulativeData = sortedActivities.reduce<CumulativeDataPoint[]>((acc, activity) => {
		const previousDistance = acc[acc.length - 1]?.total_distance || 0;

		// Convert to whole numbers to avoid floating point errors
		const total_distance = (previousDistance * 100 + activity.distance * 100) / 100;

		acc.push({
			date: activity.start_date_local,
			total_distance
		});

		return acc;
	}, []);

	return {
		status: 200,
		body: {
			cumulativeData
		}
	};
};
