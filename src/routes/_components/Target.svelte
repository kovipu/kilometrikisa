<script lang="ts">
  export let target: number;

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
  <div class="target">
    <h2>Tavoite</h2>
    <div class="target-value">
      <span>{target}</span>
      <span>km</span>
    </div>
  </div>
  <button on:click={handleChangeTargetClicked}>Päivitä</button>
</div>

<style lang="scss">
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
      background-color: #0042cc;
      color: #fff;
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 0.5rem;
      font-size: 1.2rem;
      cursor: pointer;

      &:hover {
        background-color: #003399;
      }
    }
  }
</style>
