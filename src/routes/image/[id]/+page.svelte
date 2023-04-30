<script lang="ts">
	import { push } from 'svelte-spa-router';
	import Dump from '$lib/components/Dump.svelte';
	import { image } from '$lib/service/image';
	import { loadExif } from '$lib/service/image/utils';

	export let params = {};

	const informationWidth = 500;
	let open = false;

	let metadata: Promise<Record<string, unknown>> | undefined;

	const onKeydown = (e: KeyboardEvent) => {
		console.log(e);
		switch (e.code) {
			case 'Escape':
				push('/');
				break;
			case 'Space':
				$image.getIdList().then((list) => {
					const index = list.indexOf(params.id);
					if (index === -1) return;
					const next = list[(index + 1) % list.length];
					return push(`/image/${encodeURIComponent(next)}`);
				});
				break;
		}
	};
	const onImageLoad = (e: Event) => {
		const { target } = e;
		if (!(target instanceof HTMLImageElement)) return;
		metadata = loadExif(target);
	};
</script>

<svelte:window on:keydown|preventDefault={onKeydown} />

<section
	style="
		--information-width:{informationWidth}px;
		--information-position:{informationWidth * (open ? 1 : 0)}px;
	"
>
	<button class="image-container" on:click={() => (open = !open)}>
		{#await $image.getUrl(params.id).catch(() => push('/'))}
			...
		{:then url}
			<img src={url ?? undefined} alt={params.id} on:load={onImageLoad} />
		{/await}
	</button>

	<aside>
		<div>
			{#if metadata}
				{#await metadata}
					loading...
				{:then value}
					<Dump key={params.id} {value} />
				{:catch e}
					{e instanceof Error ? e.message : e}
				{/await}
			{:else}
				loading...
			{/if}
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
