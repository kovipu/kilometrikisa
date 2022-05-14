<script lang="ts">
import { LayerCake, Svg } from "layercake";
import Multiline from "./Multiline.svelte";

export let data: CumulativeDataPoint[] = [];

const xKey = 'date'
const yKey = 'total_distance'
const zKey = 'name'

$: dataFormatted = data.map(({date, total_distance}: CumulativeDataPoint) => {
  return {
    date: Date.parse(date),
    total_distance: total_distance,
  }
})
</script>

<style>
  .chart-container {
    width: 100%;
    height: 400px;
  }
</style>

<div class="chart-container">
  <LayerCake
    x={xKey}
    y={yKey}
    yDomain={[0, 1500 * 1000]}
    data={dataFormatted}
  >
    <Svg>
      <Multiline />
    </Svg>
  </LayerCake>
</div>