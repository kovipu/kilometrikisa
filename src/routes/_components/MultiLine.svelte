<script lang="ts">
	import { getContext } from 'svelte';

	const { data, xGet, yGet } = getContext('LayerCake');

	$: path =
		'M' +
		$data
			.map((d: CumulativeDataPoint) => {
				return $xGet(d) + ',' + $yGet(d);
			})
			.join('L');

	$: console.log(path);
</script>

<g>
	<path class="path-line" d={path} stroke="#ab00d6" />
</g>

<style>
	.path-line {
		fill: none;
		stroke-linejoin: round;
		stroke-linecap: round;
		stroke-width: 2;
	}
</style>
