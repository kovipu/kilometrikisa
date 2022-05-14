import type { RequestHandler } from "@sveltejs/kit";
import strava from "strava-v3";
import dotenv from 'dotenv';

dotenv.config()

export const get: RequestHandler = async ({ url }) => {
  const code = url.searchParams.get("code");

  if (!code) {
    return {
      status: 400,
      body: "Strava access code not found"
    }
  }

  const tokenResponse = await strava.oauth.getToken(code);

  return {
    body: tokenResponse
  }
}
