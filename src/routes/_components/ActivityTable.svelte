<script lang="ts">
  import { reverse } from 'ramda';
  import { format } from 'date-fns';
  import fi from 'date-fns/locale/fi/index.js';

  export let athleteData: AthleteData[];

  const formatDate = (dateTime: number) =>
    format(new Date(dateTime), 'cccccc d.M.', { locale: fi });
  const formatTime = (dateTime: number) => format(new Date(dateTime), 'HH:mm');

  const formatElapsedTime = (elapsedTime: number) => {
    const hours = Math.floor(elapsedTime / 3600);
    const minutes = Math.floor((elapsedTime - hours * 3600) / 60);
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
  };

  const formatSpeed = (speed: number) => `${Math.round(speed * 3.6)} km/h`;

  const formatDistance = (distance: number): string => `${(distance / 1000).toFixed(1)} km`;
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
