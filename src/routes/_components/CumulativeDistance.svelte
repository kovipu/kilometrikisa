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

  const startDate = new Date('2022-05-01T00:00:00.000Z');
  const endDate = new Date('2022-09-22T23:59:59.999Z');

  const ticks = eachDayOfInterval({ start: startDate, end: endDate }, { step: 31 }).map((d) =>
    d.getTime(),
  );

  const tooltipDataset = eachDayOfInterval({ start: startDate, end: endDate }).map((d) =>
    d.getTime(),
  );

  const target = 1000 * 1000;
  const days: number[] = eachDayOfInterval({ start: startDate, end: endDate }).map((d) =>
    d.getTime(),
  );
  const targetData: CumulativeDataPoint[] = days.map((date, i) => {
    const total_distance = target * ((i + 1) / days.length);
    return {
      date,
      total_distance,
    };
  });

  const dataWithTarget = [
    {
      firstname: 'Tavoite',
      color: '#00bbff35',
      cumulativeData: targetData,
    },
  ].concat(athleteData);
  const flatDataWithTarget = targetData.concat(flatData);

  const xKey = 'date';
  const yKey = 'total_distance';
  const zKey = 'name';
</script>

<LayerCake
  padding={{ top: 7, right: 10, bottom: 20, left: 10 }}
  x={xKey}
  y={yKey}
  z={zKey}
  xDomain={[startDate.getTime(), endDate.getTime()]}
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
    <Tooltip dataset={tooltipDataset} />
  </Html>
</LayerCake>
