<script lang="ts">
  import CumulativeDistance from './_components/CumulativeDistance.svelte';
  import StravaLink from './_components/StravaLink.svelte';
  import ActivityTable from './_components/ActivityTable.svelte';
  import Target from './_components/Target.svelte';

  export let athleteData: AthleteDataWithColor[];
  export let flatData: CumulativeDataPoint[];

  let target: number = 1000;

  const colors = [
    '#00bbff',
    '#ff7ac7',
    '#ffc400',
    '#ff3e00',
    '#77dd77',
    '#ffe4b8',
    '#ffb3c0',
    '#ff00cc',
  ];

  $: athleteDataWithColor = athleteData.map((data, i) => ({
    ...data,
    color: colors[i % colors.length],
  }));
</script>

<div class="hero">
  <header>
    <div>
      <h1>Kilometrikisa</h1>
      <StravaLink />
    </div>
  </header>

  <div class="chart-container">
    <CumulativeDistance athleteData={athleteDataWithColor} {flatData} {target} />
  </div>
</div>

<Target bind:target />

<div class="table-container">
  <ActivityTable {athleteData} />
</div>

<style lang="scss">
  .hero {
    background-color: #f8fafb;
    padding-bottom: 3rem;

    > header {
      background-color: #fff;
      border-bottom: 1px solid #ddd;
      padding: 0.8rem 0;

      > div {
        width: 80%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin: 0 auto;

        > h1 {
          font-size: 1.4rem;
        }
      }
    }
  }

  .chart-container {
    width: 80%;
    height: 12rem;
    margin: 2rem auto;
    display: flex;
    justify-content: center;
    align-items: center;

    @media screen and (min-width: 768px) {
      height: 32rem;
    }
  }

  .table-container {
    /* width: 80%; */
    margin: 2rem auto;
    overflow-x: auto;

    @media screen and (min-width: 768px) {
      width: 80%;
    }
  }
</style>
