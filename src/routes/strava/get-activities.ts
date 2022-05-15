import type { RequestHandler } from '@sveltejs/kit';
import strava from 'strava-v3';
import dotenv from 'dotenv';
import cookie from 'cookie';
import { sortBy } from 'ramda';
import { eachDayOfInterval } from 'date-fns';

dotenv.config();

const startDate = new Date('2022-05-01');
const endDate = new Date('2022-08-31');

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

	const after = startDate.getTime() / 1000;

	const activities: Activity[] = await strava.athlete.listActivities({
		access_token,
		after,
		per_page: 200
	});
	const sortedActivities = sortBy((a) => a.start_date_local, activities);

	const cumulativeData = sortedActivities.reduce<AggregatedActivity[]>((acc, activity) => {
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
			total_distance
		});

		return acc;
	}, []);

	const currentValues: CumulativeDataPoint[] = cumulativeData.map(({ date, total_distance }) => ({
		date,
		total_distance
	}));
	const target1000km = buildTargetData(1000 * 1000);
	const target1500km = buildTargetData(1500 * 1000);

	const data: CumulativeData[] = [
		{
			name: '1000km',
			color: '#00bcd4',
			values: target1000km
		},
		{
			name: '1500km',
			color: '#ff9800',
			values: target1500km
		},
		{
			name: 'Konsta',
			color: '#f44336',
			values: currentValues
		}
	];

	const flatData = currentValues.concat(target1000km, target1500km);

	return {
		status: 200,
		body: {
			data,
			flatData,
			activities: cumulativeData
		}
	};
};

const buildTargetData = (target: number): CumulativeDataPoint[] => {
	// build
	const days = eachDayOfInterval({ start: startDate, end: endDate });

	return days.map((day, i) => {
		const total_distance = target * ((i + 1) / days.length);

		return {
			date: day.getTime(),
			total_distance
		};
	});
};
