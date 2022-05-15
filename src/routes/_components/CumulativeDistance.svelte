<script lang="ts">
	import { Html, LayerCake, Svg } from 'layercake';
	import AxisX from './AxisX.svelte';
	import Multiline from './Multiline.svelte';
	import { eachDayOfInterval } from 'date-fns';
	import Legend from './Legend.svelte';
	import Tooltip from './Tooltip.svelte';

	export let data: CumulativeData[] = [];
	export let flatData: CumulativeDataPoint[] = [];

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
