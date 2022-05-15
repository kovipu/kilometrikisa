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
		reverse(values).find((d: CumulativeDataPoint) => $x(d) < (closestDate || 0));

	const formatDistance = (distance: number): string => `${(distance / 1000).toFixed(1)} km`;
</script>

<div
	class="bg"
	on:mousemove={findClosestDate}
	on:mouseout={() => (closestDate = undefined)}
	on:blur={() => (closestDate = undefined)}
/>

{#if closestDate}
  <div class="line" style="left: {left}px;"></div>
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
				<em>{formatDistance($y(findValue(group.values) || {}))}</em>
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
		background: rgba(255, 255, 255, 0.8);
    border: 1px solid #ccc;
    color: #444;
		transform: translate(-50%);
		padding: 0.3rem;
    font-size: 0.9rem;

    @media screen and (min-width: 768px) {
      font-size: 1rem;
    }

	  em {
      color: #000;
			font-weight: bold;
		}
	}

  .line {
    position: absolute;
    top: 0;
    bottom: 0;
    width: 1px;
    border-left: 1px dotted black;
    pointer-events: none;
  }
</style>
