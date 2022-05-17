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
  totalDistance: number;
};

type AthleteData = {
  id?: number;
  firstname: string;
  lastname?: string;
  profile?: string;
  cumulativeData: CumulativeDataPoint[];
  activityData: {
    totalDistance: number;
    totalRideDays: number;
    totalRideTime: number;
    averageRideLength: number;
    averageRideDistance: number;
    averageSpeed: number;
    maxSpeed: number;
  };
};

type AthleteDataWithColor = AthleteData & { color: string };

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
  elapsedTime: number;
  averageSpeed: number;
  totalDistance: number;
};
