import type { RequestHandler } from "@sveltejs/kit";
import strava from "strava-v3";
import dotenv from 'dotenv';
import cookie from 'cookie';

dotenv.config()

export const get: RequestHandler = async ({ url }) => {
  const code = url.searchParams.get("code");

  if (!code) {
    return {
      status: 400,
      body: "Strava access code not found"
    }
  }

  const { access_token, refresh_token } = await strava.oauth.getToken(code);

  // access_token is httpOnly for security.
  const accessTokenCookie = cookie.serialize("access_token", access_token, {
    path: '/',
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 31536000
  });

  const refreshTokenCookie = cookie.serialize("refresh_token", refresh_token, {
    path: '/',
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 31536000
  });

  return {
    status: 302,
    headers: {
      location: '/',
      'set-cookie': [ accessTokenCookie, refreshTokenCookie ],
    },
  }
}
