<script lang="ts">
	import { LayerCake, Svg } from 'layercake';
	import AxisX from './AxisX.svelte';
	import Multiline from './Multiline.svelte';
	import { eachDayOfInterval } from 'date-fns';

	export let rawData: CumulativeDataPoint[] = [];

	const startDate = new Date('2022-05-01T00:00:00.000Z');
	const endDate = new Date('2022-08-31T23:59:59.999Z');

	const ticks = eachDayOfInterval({ start: startDate, end: endDate }, { step: 14 }).map((d) =>
		d.getTime()
	);

	const xKey = 'date';
	const yKey = 'total_distance';
	const zKey = 'name';

	const target1500 = [
		{ date: startDate.getTime(), total_distance: 0 },
		{ date: endDate.getTime(), total_distance: 1500 * 1000 }
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

<LayerCake
	padding={{ top: 7, right: 10, bottom: 20, left: 25 }}
	x={xKey}
	y={yKey}
	z={zKey}
	yDomain={[0, 1500 * 1000]}
	{data}
	{flatData}
>
	<Svg>
		<AxisX {ticks} />
		<Multiline />
	</Svg>
</LayerCake>
