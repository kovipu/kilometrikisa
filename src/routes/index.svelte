<script lang="ts">
const clientId = "84299";
const redirectUri = "http://localhost:3000/strava/oauth-callback";
const loginUri = `https://www.strava.com/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code`;
</script>

<h1>Kilometrikisa statsit</h1>

<a href={loginUri}>Authenticate Strava</a>