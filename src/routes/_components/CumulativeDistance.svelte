<script lang="ts">
  import { Html, LayerCake, Svg } from 'layercake';
  import AxisX from './AxisX.svelte';
  import Multiline from './Multiline.svelte';
  import { eachDayOfInterval } from 'date-fns';
  import Legend from './Legend.svelte';
  import Tooltip from './Tooltip.svelte';
  import AxisY from './AxisY.svelte';

  export let athleteData: AthleteDataWithColor[] = [];
  export let flatData: CumulativeDataPoint[] = [];
  export let target: number;

  const startDate = new Date('2022-05-01T00:00:00.000Z');
  const endDate = new Date('2022-09-22T23:59:59.999Z');

  const ticks = eachDayOfInterval({ start: startDate, end: endDate }, { step: 31 }).map((d) =>
    d.getTime(),
  );

  const days: number[] = eachDayOfInterval({ start: startDate, end: endDate }).map((d) =>
    d.getTime(),
  );

  let targetData: CumulativeDataPoint[] = [];
  $: targetData = days.map((date, i) => {
    const totalDistance = 1000 * target * ((i + 1) / days.length);
    return {
      date,
      totalDistance,
    };
  });

  $: dataWithTarget = [
    {
      firstname: 'Tavoite',
      color: '#00bbff35',
      cumulativeData: targetData,
    },
  ].concat(athleteData);
  $: flatDataWithTarget = targetData.concat(flatData);

  const xKey = 'date';
  const yKey = 'totalDistance';
  const zKey = 'name';
  const xDomain = [startDate.getTime(), endDate.getTime()];
  $: yDomain = [0, (target + 500) * 1000]; // add a bit of space on top.
</script>

<LayerCake
  padding={{ top: 7, right: 10, bottom: 20, left: 10 }}
  x={xKey}
  y={yKey}
  z={zKey}
  {xDomain}
  {yDomain}
  data={dataWithTarget}
  flatData={flatDataWithTarget}
>
  <Svg>
    <AxisY />
    <AxisX {ticks} />
    <Multiline />
  </Svg>
  <Html>
    <Legend />
    <Tooltip dataset={days} />
  </Html>
</LayerCake>
