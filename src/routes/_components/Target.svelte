<script lang="ts">
  import { formatDistance } from '$lib/formatters';

  export let target: number;
  export let currentDistance: number | null = null;
  export let currentDayTarget: number;

  $: difference = currentDistance ? currentDistance - currentDayTarget : null;

  const handleChangeTargetClicked = () => {
    const newTarget = Number(prompt('Syötä uusi tavoite:', target.toString()));

    if (isNaN(newTarget)) {
      alert('Tavoite ei ole numero!');
      return;
    }

    target = newTarget;
  };
</script>

<div class="target-container">
  {#if currentDistance && difference}
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
  {/if}
  <div class="number-container target">
    <h2>Oma tavoite</h2>
    <div class="value">
      <span>{target}</span>
      <span>km</span>
    </div>
  </div>
  <button on:click={handleChangeTargetClicked}>Päivitä tavoite</button>
</div>

<style lang="scss">
  .target-container {
    width: 80%;
    margin: 0 auto;
    display: flex;
    flex-wrap: wrap;
    align-items: center;

    > .number-container {
      margin-top: 1rem;
      margin-right: .4rem;
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

      &.target {
        margin-left: auto;
      }
    }

    > button {
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
  }
</style>
