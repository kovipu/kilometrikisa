<script lang="ts">
	import { getContext } from 'svelte';
	import { format } from 'date-fns';
	import fi from 'date-fns/locale/fi';
	import { reverse } from 'ramda';

	const { data, xGet, y, x, xScale } = getContext('LayerCake');

	export let dataset: number[];

	let closestDate: number | undefined = undefined;
	$: left = $xScale(closestDate);

	$: findClosestDate = (ev: any) => {
		const { layerX } = ev;
		// Find the item in data with closest X value
		closestDate = dataset.find((d: number) => $xScale(d) > layerX);
	};

	$: findValue = (values: CumulativeDataPoint[]) =>
		reverse(values).find((d: CumulativeDataPoint) => $x(d) < closestDate);

  const formatDistance = (distance: number): string => {
    return `${(distance / 1000).toFixed(1)} km`;
  };
</script>

<div
	class="bg"
	on:mousemove={findClosestDate}
	on:mouseout={() => (closestDate = undefined)}
	on:blur={() => (closestDate = undefined)}
/>

{#if closestDate}
	<div
		class="tooltip"
		style="
  left: {left}px;
"
	>
		<em>{format(new Date(closestDate), 'd. MMM', { locale: fi })}</em>
		{#each $data as group}
			<p>
				<span>{group.name}:</span>
				{formatDistance($y(findValue(group.values) || {}))}
			</p>
		{/each}
	</div>
{/if}

<style lang="scss">
	.bg {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
	}

	.tooltip {
		pointer-events: none;
		position: absolute;
		top: 0;
		background: salmon;
		transform: translate(-50%);
		padding: 0.5rem;

		> em {
			font-weight: bold;
		}
	}
</style>
