/// <reference types="@sveltejs/kit" />

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare namespace App {
  // interface Locals {}
  // interface Platform {}
  // interface Session {}
  // interface Stuff {}
}

type AthleteSession = {
  id: number;
  firstname: string;
  lastname: string;
  access_token: string;
  refresh_token: string;
  profile_medium: string;
  profile: string;
};

type CumulativeDataPoint = {
  date: number;
  total_distance: number;
};

type CumulativeData = {
  name: string;
  color: string;
  values: CumulativeDataPoint[];
};

type Activity = {
  name: string;
  start_date: string;
  start_date_local: string;
  distance: number;
  moving_time: number;
  elapsed_time: number;
  total_elevation_gain: number;
  average_speed: number;
  max_speed: number;
  upload_id: number;
};

type AggregatedActivity = {
  name: string;
  date: number;
  distance: number;
  elapsed_time: number;
  average_speed: number;
  max_speed: number;
  total_distance: number;
};
