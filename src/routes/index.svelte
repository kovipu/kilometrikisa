<script lang="ts">
  import CumulativeDistance from './_components/CumulativeDistance.svelte';
  import Loading from './_components/Loading.svelte';

  import { onMount } from 'svelte';
  import StravaLink from './_components/StravaLink.svelte';
  import ActivityTable from './_components/ActivityTable.svelte';

  let loading = true;
  let athleteData: AthleteDataWithColor[] = [];
  let flatData: CumulativeDataPoint[] = [];
  let target: number = 1000;

  const colors = ['#00bbff', '#ff7ac7', '#ffc400', '#ff3e00', '#77dd77', '#ffb347', '#ffe4b8', '#ffb3c0', '#ff00cc'];

  onMount(async () => {
    const response = await fetch('/strava/get-activities');
    const json: {
      athleteData: AthleteData[];
      flatData: CumulativeDataPoint[];
    } = await response.json();
    loading = false;
    athleteData = json.athleteData.map((athelete, i) => ({
      ...athelete,
      color: colors[i % colors.length],
    }));
    flatData = json.flatData;
  });

  const handleChangeTargetClicked = () => {
    const newTarget = Number(prompt('Syötä uusi tavoite:', target.toString()));

    if (isNaN(newTarget)) {
      alert('Tavoite ei ole numero!');
      return;
    }

    target = newTarget;
  }
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
    <CumulativeDistance {athleteData} {flatData} {target} />
    {/if}
  </div>
</div>

<div class="target-container">
  <div class="target">
    <h2>Tavoite</h2>
    <div class="target-value">
      <span>{target}</span>
      <span>km</span>
    </div>
  </div>
  <button on:click={handleChangeTargetClicked}>Päivitä</button>
</div>

<div class="table-container">
  {#if !loading}
    <ActivityTable {athleteData} />
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

  .target-container {
    margin: 2rem auto;
    display: flex;
    justify-content: center;
    align-items: center;

    > .target {
      margin-right: 1rem;

      > h2 {
        color: #aaa;
      }

      > .target-value {
        font-size: 1.5rem;
      }
    }

    > button {
      background-color: #00bbff;
      color: #fff;
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 0.5rem;
      font-size: 1.2rem;
      cursor: pointer;

      &:hover {
        background-color: #00a3e0;
      }
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
