<script lang="ts">
  import { getContext } from 'svelte';

  const { yScale } = getContext('LayerCake');

  const ticks = 5;
  $: tickVals = $yScale.ticks(ticks);

  const formatDistance = (distance: number): string => `${(distance / 1000).toFixed()}`;
</script>

<g class="axis y-axis">
  {#each tickVals as tick}
    <g class="tick" transform="translate(-10,{$yScale(tick)})">
      <line class="gridline" x2="100%" />
      <text text-anchor="end" transform="translate(-3, 3)">{formatDistance(tick)}</text>
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

    > .gridline {
      stroke-dasharray: 2;
      stroke: #aaa;
    }
  }
</style>
