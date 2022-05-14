<script lang="ts">
	import CumulativeDistance from './_components/CumulativeDistance.svelte';

	import { onMount } from 'svelte';

	const clientId = '84299';
	const redirectUri = 'http://localhost:3000/strava/oauth-callback';
	const scope = 'activity:read';
	const loginUri = `https://www.strava.com/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&response_type=code`;

	let cumulativeData: CumulativeDataPoint[];

	onMount(async () => {
		const response = await fetch('/strava/get-activities');
		const data: { cumulativeData: CumulativeDataPoint[] } = await response.json();
		cumulativeData = data.cumulativeData;
	});
</script>

<h1>Kilometrikisa statsit</h1>

<CumulativeDistance data={cumulativeData} />

<a href={loginUri}>Authenticate Strava</a>
