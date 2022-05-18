<script lang="ts">
  import { formatDistance, formatElapsedTime, formatSpeed } from '$lib/formatters';

  export let athleteData: AthleteData[];
</script>

<table>
  <thead>
    <tr>
      <td>Kuka</td>
      <td>Kilometrit</td>
      <td>Ajopäivät</td>
      <td>Lenkin pituus ka.</td>
      <td>Lenkin kesto ka.</td>
      <td>Keskinopeus</td>
      <td>Huippunopeus</td>
    </tr>
  </thead>
  <tbody>
    {#each athleteData as { firstname, lastname, activityData }}
      <tr>
        <td>{firstname} {lastname}</td>
        <td>{formatDistance(activityData.totalDistance)}</td>
        <td>{activityData.totalRideDays}</td>
        <td>{formatDistance(activityData.averageRideDistance)}</td>
        <td>{formatElapsedTime(activityData.averageRideLength)}</td>
        <td>{formatSpeed(activityData.averageSpeed)}</td>
        <td>{formatSpeed(activityData.maxSpeed)}</td>
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
