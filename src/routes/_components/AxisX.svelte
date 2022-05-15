<script lang="ts">
	import { getContext } from 'svelte';
	import { format } from 'date-fns';

	export let ticks: number[] = [];

	const { padding, xScale, yRange } = getContext('LayerCake');

	const formatTick = (tick: number) => format(new Date(tick), 'd.MM.');
</script>

<g class="axis x-axis" transform="translate(0, {$padding.bottom})">
	{#each ticks as tick, i}
		<g class="tick" transform="translate({$xScale(tick)},{$yRange[0]})">
			<text text-anchor="middle">{formatTick(tick)}</text>
		</g>
	{/each}
</g>

<style>
	.tick {
		font-size: 0.725rem;
		font-weight: 200;
	}
</style>
