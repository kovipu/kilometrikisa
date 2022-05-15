<script lang="ts">
	import { getContext } from 'svelte';

	const { data, height, padding } = getContext('LayerCake');

	$: console.log($height);
</script>

<div
	class="legend"
	style="
  top:{$height + $padding.bottom}px;
"
>
	{#each $data as group}
		<span class="legend-item">
			<em style="color:{group.color};">●</em>
			{group.name}
		</span>
	{/each}
</div>

<style lang="scss">
	.legend {
		width: 100%;
		padding: 0.5rem;
		position: absolute;
		display: flex;
		flex-direction: row-reverse;
		justify-content: center;

		> .legend-item {
			padding: 0.5rem;
			font-size: 0.9rem;

			@media screen and (min-width: 768px) {
				font-size: 1rem;
			}
		}
	}

	em {
		font-style: normal;
		font-weight: bold;
	}
</style>
