<script lang="ts">
  import { formatDistance } from '$lib/formatters';
  import { numWeeks } from '$lib/constants'
  import ActivityTable from './ActivityTable.svelte'

  export let target: number;
  export let currentDistance: number | null = null;
  export let currentDayTarget: number;
  export let athleteData: AthleteData;

  $: difference = currentDistance ? currentDistance - currentDayTarget : null;

  $: weeklyGoal = target * 1000 / numWeeks;

  const handleChangeTargetClicked = () => {
    const newTarget = Number(prompt('Syötä uusi tavoite:', target.toString()));

    if (isNaN(newTarget)) {
      alert('Tavoite ei ole numero!');
      return;
    }

    localStorage.setItem('target', newTarget.toString());
    target = newTarget;
  };
</script>

<div class="info-container">
  <div class="data-container">
    <div class="target-container">
      <div class="target-row">
        <div class="number-container target">
          <h2>Oma tavoite</h2>
          <div class="value">
            <span>{target}</span>
            <span>km</span>
          </div>
        </div>
        <button on:click={handleChangeTargetClicked}>Päivitä tavoite</button>
      </div>
      {#if currentDistance && difference}
        <div class="target-row">
          <div class="number-container">
            <h2>Tulos</h2>
            <div class="value">
              {formatDistance(currentDistance)}
            </div>
          </div>
          <div class="number-container">
            <h2>Tavoitevauhti</h2>
            <div class="value">
              {formatDistance(currentDayTarget)}
            </div>
          </div>
          <div class="number-container">
            <h2>Toteutuminen</h2>
            <div class={`value ${difference >= 0 ? 'positive' : 'negative'}`}>
              {difference > 0 ? '+' : ''}{formatDistance(difference)}
            </div>
          </div>
        </div>
      {/if}
    </div>
    <div class="table-container">
      <ActivityTable {athleteData} />
    </div>
  </div>
  <div class="data-container">
    <div class="number-container">
      <h2>Viikon tavoite</h2>
      <div class="value">
        {formatDistance(weeklyGoal)}
      </div>
    </div>
  </div>
</div>

<style lang="scss">
  .info-container {
    display: flex;
    flex-wrap: wrap;
    width: 90%;
    margin: 2rem auto;
    gap: 2rem;

    > .data-container {
      padding: 1rem;
      border: 3px solid #ccc;
      border-radius: 1.5rem;
    }

    .target-row {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    button {
      background-color: #0042cc;
      color: #fff;
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 0.5rem;
      font-size: 1rem;
      cursor: pointer;

      &:hover {
        background-color: #003399;
      }
    }

    .number-container {
      margin-top: 1rem;
      margin-right: 0.4rem;
      margin-bottom: 1rem;

      @media screen and (min-width: 768px) {
        margin-right: 2rem;
      }

      > h2 {
        color: #555;
        padding: 0.2rem 0;
      }

      > .value {
        font-size: 1.5rem;

        &.positive {
          color: #07cf07;
        }

        &.negative {
          color: #ff0000;
        }
      }
    }
  }
</style>
