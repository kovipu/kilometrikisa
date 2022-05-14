<script lang="ts">
	import { getContext } from 'svelte';

	const { data, xGet, yGet, zGet } = getContext('LayerCake');

	$: console.log({ $data });

	$: path = (values: CumulativeDataPoint[]): string => {
		return (
			'M' +
			values
				.map((d: CumulativeDataPoint) => {
					return $xGet(d) + ',' + $yGet(d);
				})
				.join('L')
		);
	};
</script>

<g>
	{#each $data as group}
		<path class="path-line" d={path(group.values)} stroke={zGet(group)} />
	{/each}
</g>

<style>
	.path-line {
		fill: none;
		stroke-linejoin: round;
		stroke-linecap: round;
		stroke-width: 2;
	}
</style>
