<script lang="ts">
	import Dump from '$lib/components/Dump.svelte';
	import { image } from '$lib/service/image';
	import { loadExif } from '$lib/service/image/utils';
	import type { PageData } from './$types';
	export let data: PageData;

	const informationWidth = 500;
	let open = true;
</script>

<section
	style="
		--information-width:{informationWidth}px;
		--information-position:{informationWidth * (open ? 1 : 0)}px;
	"
>
	<button class="image-container" on:click={() => (open = !open)}>
		<img src={data.url} alt={data.id} />
	</button>

	<aside>
		<div>
			{#await $image
				.getData(data.id)
				.then((buf) => loadExif(buf, { extractSdParameters: true }))}
				loading...
			{:then value}
				<Dump key={data.id} {value} />
			{:catch e}
				{e instanceof Error ? e.message : e}
			{/await}
		</div>
	</aside>
</section>

<style>
	section {
		height: 100vh;
		width: 100vw;
		display: flex;
		overflow: hidden;
	}
	.image-container {
		flex-grow: 1;
		flex-shrink: 1;
		flex-basis: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.image-container > img {
		max-height: 100%;
		max-width: 100%;
	}
	aside {
		position: relative;
		flex-grow: 0;
		flex-shrink: 0;
		flex-basis: var(--information-position);
	}
	aside > div {
		position: absolute;
		inset: calc(var(--unit) * 4);
		background-color: var(--color);
		color: var(--bg-color);
		padding: calc(var(--unit) * 8);
		border-radius: calc(var(--unit) * 4);
		overflow-y: auto;
	}
</style>
