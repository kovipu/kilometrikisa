<script lang="ts">
	import { reverse } from 'ramda';
	import { format } from 'date-fns';
	import fi from 'date-fns/locale/fi';

	export let activities: AggregatedActivity[];
	$: console.log(activities);

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
			<td>Päivämäärä</td>
			<td>Kellonaika</td>
			<td>Kesto</td>
			<td>Keskinopeus</td>
			<td>Huippunopeus</td>
			<td>Matka</td>
			<td>Yhteensä</td>
		</tr>
	</thead>
	<tbody>
		{#each reverse(activities) as { date, elapsed_time, average_speed, max_speed, distance, total_distance }}
			<tr>
				<td>{formatDate(date)}</td>
				<td>{formatTime(date)}</td>
				<td>{formatElapsedTime(elapsed_time)}</td>
				<td>{formatSpeed(average_speed)}</td>
				<td>{formatSpeed(max_speed)}</td>
				<td>{formatDistance(distance)}</td>
				<td>{formatDistance(total_distance)}</td>
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
