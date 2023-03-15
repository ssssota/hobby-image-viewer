<script lang="ts" context="module">
	export const viewName = 'List';
</script>

<script lang="ts">
	import { convertFileSrc } from '@tauri-apps/api/tauri';

	export let images: string[];
</script>

<ul>
	{#each images as image}
		<li>
			<img src={convertFileSrc(image)} alt="" loading="lazy" />
			{image}
		</li>
	{/each}
</ul>

<style>
	li {
		color: white;
	}
	img {
		height: 1em;
	}
</style>
