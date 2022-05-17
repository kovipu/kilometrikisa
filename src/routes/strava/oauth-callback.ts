import type { RequestHandler } from '@sveltejs/kit';
import strava from 'strava-v3';

import { updateAthlete } from './_db';

export const get: RequestHandler = async ({ url }) => {
  const code = url.searchParams.get('code');

  if (!code) {
    return {
      status: 400,
      body: 'Strava access code not found',
    };
  }

  const { access_token, refresh_token, athlete } = await strava.oauth.getToken(code);
  const { id, firstname, lastname, profile_medium, profile } = athlete;

  // Update athlete session
  const athleteSession: AthleteSession = {
    id,
    firstname,
    lastname,
    profile_medium,
    profile,
    access_token,
    refresh_token,
  };
  updateAthlete(athleteSession);

  return {
    status: 302,
    headers: {
      location: '/',
    },
  };
};
