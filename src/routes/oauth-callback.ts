import type { RequestHandler } from '@sveltejs/kit';
import strava from 'strava-v3';
import cookie from 'cookie';

import { updateAthlete } from '$lib/_db';

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

  const sessionCookie = cookie.serialize('session', JSON.stringify(athleteSession), {
    path: '/',
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 31536000,
  });

  return {
    status: 302,
    headers: {
      location: '/',
      'set-cookie': sessionCookie,
    },
  };
};
