<script lang="ts">
  import { Html, LayerCake, Svg } from 'layercake';
  import AxisX from './AxisX.svelte';
  import MultiLine from './MultiLine.svelte';
  import { eachDayOfInterval } from 'date-fns';
  import Legend from './Legend.svelte';
  import Tooltip from './Tooltip.svelte';
  import AxisY from './AxisY.svelte';
  import { endDateTime, startDateTime } from '$lib/constants';

  export let athleteData: AthleteDataWithColor[] = [];
  export let flatData: CumulativeDataPoint[] = [];
  export let target: number;
  export let targetData: CumulativeDataPoint[];
  export let days: number[];

  const ticks = eachDayOfInterval({ start: startDateTime, end: endDateTime }, { step: 31 }).map(
    (d) => d.getTime(),
  );

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
  const xDomain = [startDateTime.getTime(), endDateTime.getTime()];
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
    <MultiLine />
  </Svg>
  <Html>
    <Legend />
    <Tooltip dataset={days} />
  </Html>
</LayerCake>
