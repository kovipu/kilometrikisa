<script lang="ts">
  import { getContext } from 'svelte';
  import { format } from 'date-fns';
  import fi from 'date-fns/locale/fi/index.js';

  export let ticks: number[] = [];

  const { padding, xScale, yRange } = getContext('LayerCake');

  const formatTick = (tick: number) => format(new Date(tick), 'LLL', { locale: fi });
</script>

<g class="axis x-axis" transform="translate(0, {$padding.bottom})">
  {#each ticks as tick}
    <g class="tick" transform="translate({$xScale(tick) + 15},{$yRange[0]})">
      <text text-anchor="middle">{formatTick(tick)}</text>
    </g>
  {/each}
</g>

<style lang="scss">
  .tick {
    font-weight: 600;
    fill: #c0cdd6;
    font-size: 0.9rem;

    @media screen and (min-width: 768px) {
      font-size: 1rem;
    }
  }
</style>
