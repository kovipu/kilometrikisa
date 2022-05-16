<script lang="ts">
  import CumulativeDistance from './_components/CumulativeDistance.svelte';
  import Loading from './_components/Loading.svelte';

  import { onMount } from 'svelte';
  import StravaLink from './_components/StravaLink.svelte';
  import ActivityTable from './_components/ActivityTable.svelte';

  let loading = true;
  let data: CumulativeData[];
  let flatData: CumulativeDataPoint[];
  let activities: AggregatedActivity[];

  onMount(async () => {
    const response = await fetch('/strava/get-activities');
    const json: {
      data: CumulativeData[];
      flatData: CumulativeDataPoint[];
      activities: AggregatedActivity[];
    } = await response.json();
    loading = false;
    data = json.data;
    flatData = json.flatData;
    activities = json.activities;
  });
</script>

<div class="hero">
  <header>
    <div>
      <h1>Kilometrikisa</h1>
      <StravaLink />
    </div>
  </header>

  <div class="chart-container">
    {#if loading}
      <Loading />
    {:else}
      <CumulativeDistance {data} {flatData} />
    {/if}
  </div>
</div>
<div class="table-container">
  {#if !loading}
    <ActivityTable {activities} />
  {/if}
</div>

<style lang="scss">
  .hero {
    background-color: #f8fafb;
    padding-bottom: 3rem;

    > header {
      background-color: #fff;
      border-bottom: 1px solid #ddd;
      padding: 0.6rem 0;

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
