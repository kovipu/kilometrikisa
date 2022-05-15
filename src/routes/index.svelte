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

<div class="hero">
	<header>
		<h1>Kilometrikisa</h1>
		<a href={loginUri}>Strava tunnistautuminen</a>
	</header>

	<div class="chart-container">
		{#if loading}
			<Loading />
		{:else}
			<CumulativeDistance rawData={cumulativeData} />
		{/if}
	</div>
</div>

<style lang="scss">
	.hero {
		background-color: #f8fafb;
		padding-bottom: 1rem;

		> header {
			display: flex;
			justify-content: space-between;
			align-items: center;
			background-color: #fff;
			border-bottom: 1px solid #ddd;
			padding: 0.6rem 2rem;

			> h1 {
				font-size: 1.4rem;
				color: '';
			}

			> a {
				text-decoration: none;
				color: #0042cc;

				&:hover {
					text-decoration: underline;
				}
			}
		}
	}

	.chart-container {
		width: 90%;
		height: 32rem;
		margin: 2rem auto 2rem auto;
		display: flex;
		justify-content: center;
		align-items: center;
	}
</style>
