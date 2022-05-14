import type { RequestHandler } from "@sveltejs/kit";
import strava from "strava-v3";
import dotenv from 'dotenv';
import cookie from 'cookie';

dotenv.config()

export const get: RequestHandler = async ({ request }) => {
  const cookies = request.headers.get('cookie');

  if (!cookies) {
    return {
      status: 400,
      body: "Strava access code not found"
    }
  }

  const { access_token } = cookie.parse(cookies);

  if (!access_token) {
    return {
      status: 400,
      body: "Strava access code not found"
    }
  }

  const after = Date.parse("2022-05-01T00:00:00Z") / 1000;

  const activities = await strava.athlete.listActivities({ access_token, after, per_page: 200 })

  return {
    body: activities
  }
}