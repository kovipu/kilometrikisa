<script lang="ts">
	import CumulativeDistance from './_components/CumulativeDistance.svelte';
	import Loading from './_components/Loading.svelte';

	import { onMount } from 'svelte';

	const clientId = '84299';
	const redirectUri = 'http://localhost:3000/strava/oauth-callback';
	const scope = 'activity:read';
	const loginUri = `https://www.strava.com/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&response_type=code`;

	let loading = true;
	let cumulativeData: CumulativeDataPoint[];

	onMount(async () => {
		const response = await fetch('/strava/get-activities');
		const data: { cumulativeData: CumulativeDataPoint[] } = await response.json();
		loading = false;
		cumulativeData = data.cumulativeData;
	});
</script>

<h1>Kilometrikisa statsit</h1>

<div class="chart-container">
	{#if loading}
		<Loading />
	{:else}
		<CumulativeDistance rawData={cumulativeData} />
	{/if}
</div>

<a href={loginUri}>Authenticate Strava</a>

<style>
	.chart-container {
		width: 100%;
		height: 400px;
		display: flex;
		justify-content: center;
		align-items: center;
	}
</style>
