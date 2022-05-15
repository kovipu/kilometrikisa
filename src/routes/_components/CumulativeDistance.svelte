<script lang="ts">
	import { Html, LayerCake, Svg } from 'layercake';
	import AxisX from './AxisX.svelte';
	import Multiline from './Multiline.svelte';
	import { eachDayOfInterval } from 'date-fns';
	import Legend from './Legend.svelte';
	import Tooltip from './Tooltip.svelte';

	export let rawData: CumulativeDataPoint[] = [];

	const startDate = new Date('2022-05-01T00:00:00.000Z');
	const endDate = new Date('2022-08-31T23:59:59.999Z');

	const ticks = eachDayOfInterval({ start: startDate, end: endDate }, { step: 14 }).map((d) =>
		d.getTime()
	);

	const tooltipDataset = eachDayOfInterval({ start: startDate, end: endDate }).map((d) =>
		d.getTime()
	);

	const xKey = 'date';
	const yKey = 'total_distance';
	const zKey = 'name';

	const target1500 = [
		{ date: startDate.getTime(), total_distance: 0 },
		{ date: endDate.getTime(), total_distance: 1500 * 1000 }
	];

	const target1000 = [
		{ date: startDate.getTime(), total_distance: 0 },
		{ date: endDate.getTime(), total_distance: 1000 * 1000 }
	];

	$: dataFormatted = rawData.map(({ date, total_distance }: CumulativeDataPoint) => ({
		date: Date.parse(date),
		total_distance: total_distance
	}));

	$: data = [
		{
			[zKey]: '1000km tavoite',
			color: '#ccc',
			values: target1000
		},
		{
			[zKey]: '1500km tavoite',
			color: 'salmon',
			values: target1500
		},
		{
			[zKey]: 'Konsta',
			color: '#ab00d6',
			values: dataFormatted
		}
	];

	$: flatData = dataFormatted.concat(target1500);
</script>

<LayerCake
	padding={{ top: 7, right: 10, bottom: 20, left: 10 }}
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
	<Html>
		<Legend />
		<Tooltip dataset={tooltipDataset} />
	</Html>
</LayerCake>
