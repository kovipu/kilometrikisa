<script lang="ts">
import { onMount } from "svelte";


const clientId = "84299";
const redirectUri = "http://localhost:3000/strava/oauth-callback";
const scope = "activity:read";
const loginUri = `https://www.strava.com/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&response_type=code`;

let activities;

onMount(async () => {
  const response = await fetch('/strava/get-activities')
  activities = await response.json();
})
</script>

<h1>Kilometrikisa statsit</h1>

<a href={loginUri}>Authenticate Strava</a>