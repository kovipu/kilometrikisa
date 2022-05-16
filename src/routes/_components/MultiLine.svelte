<script lang="ts">
  import { getContext } from 'svelte';

  const { data, xGet, yGet } = getContext('LayerCake');

  $: path = (values: CumulativeDataPoint[]) =>
    'M' + values.map((d) => $xGet(d) + ',' + $yGet(d)).join('L');
</script>

<g class="line-group">
  {#each $data as group}
    <path class="path-line" d={path(group.values)} stroke={group.color} />
  {/each}
</g>

<style>
  .path-line {
    fill: none;
    stroke-linejoin: round;
    stroke-linecap: round;
    stroke-width: 2px;
  }
</style>
