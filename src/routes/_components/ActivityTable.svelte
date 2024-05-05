<script lang="ts">
  import { formatDistance, formatElapsedTime, formatSpeed } from '$lib/formatters';
  import { sort } from 'ramda';

  export let athleteData: AthleteData[];

  const sortByDistance = sort(
    (a: AthleteData, b: AthleteData) => b.activityData.totalDistance - a.activityData.totalDistance,
  );
</script>

<table>
  <thead>
    <tr>
      <td>Nimi</td>
      <td>Tulos</td>
      <td>Lenkin keskiarvo</td>
      <td>Ajopäivät</td>
    </tr>
  </thead>
  <tbody>
    {#each sortByDistance(athleteData) as { firstname, lastname, activityData }}
      <tr>
        <td>{firstname} {lastname}</td>
        <td>{formatDistance(activityData.totalDistance)}</td>
        <td>{formatDistance(activityData.averageRideDistance)}</td>
        <td>{activityData.totalRideDays}</td>
      </tr>
    {/each}
  </tbody>
</table>

<style lang="scss">
  table {
    width: 100%;
    font-size: 0.8rem;

    @media screen and (min-width: 768px) {
      font-size: 1rem;
    }

    > thead {
      font-weight: bold;
      border-bottom: 1px solid #ddd;
    }

    > tbody {
      > tr:nth-child(even) {
        background-color: #f8fafb;
      }
    }

    td {
      min-width: 50px;
      padding: 0.5rem 0.5rem;

      @media screen and (min-width: 768px) {
        padding: 0.8rem 0.5rem;
      }
    }
  }
</style>
