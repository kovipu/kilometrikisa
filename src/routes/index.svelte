<script lang="ts">
	import CumulativeDistance from './_components/CumulativeDistance.svelte';
	import Loading from './_components/Loading.svelte';

	import { onMount } from 'svelte';
	import StravaLink from './_components/StravaLink.svelte';

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
		<div>
			<h1>Kilometrikisa</h1>
			<StravaLink />
		</div>
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
		padding-bottom: 3rem;

		> header {
			background-color: #fff;
			border-bottom: 1px solid #ddd;
			padding: 0.6rem 0;

			> div {
				width: 90%;
				display: flex;
				justify-content: space-between;
				align-items: center;
				margin: 0 auto;

				> h1 {
					font-size: 1.4rem;
				}
			}
		}
	}

	.chart-container {
		width: 90%;
		height: 12rem;
		margin: 2rem auto 2rem auto;
		display: flex;
		justify-content: center;
		align-items: center;

		@media screen and (min-width: 768px) {
			height: 32rem;
		}
	}
</style>
