import { redirect, type RequestHandler } from '@sveltejs/kit';
import strava from 'strava-v3';

import { updateAthlete } from '$lib/db';

export const GET: RequestHandler = async ({ url, cookies }) => {
  const code = url.searchParams.get('code');

  if (!code) {
    return new Response('Strava access code not found', { status: 400 });
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

  const sessionCookie = JSON.stringify(athleteSession);

  cookies.set('session', sessionCookie, {
    path: '/',
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 31536000,
  });
  throw redirect(302, '/');
};
