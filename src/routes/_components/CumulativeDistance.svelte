<script lang="ts">
	import { LayerCake, Svg } from 'layercake';
	import Multiline from './Multiline.svelte';

	export let rawData: CumulativeDataPoint[] = [];

	const xKey = 'date';
	const yKey = 'total_distance';
	const zKey = 'name';

	const target1500 = [
		{ date: Date.parse('2022-05-01'), total_distance: 0 },
		{ date: Date.parse('2022-09-01'), total_distance: 1500 * 1000 }
	];

	$: dataFormatted = rawData.map(({ date, total_distance }: CumulativeDataPoint) => ({
		date: Date.parse(date),
		total_distance: total_distance
	}));

	$: data = [
		{
			[zKey]: 'Konsta',
			values: dataFormatted
		},
		{
			[zKey]: '1500Km tavoite',
			values: target1500
		}
	];

	$: flatData = dataFormatted.concat(target1500);
</script>

<LayerCake x={xKey} y={yKey} z={zKey} yDomain={[0, 1500 * 1000]} {data} {flatData}>
	<Svg>
		<Multiline />
	</Svg>
</LayerCake>
