<script lang="ts" context="module">
	export const viewName = 'Slide';
</script>

<script lang="ts">
	import { convertFileSrc } from '@tauri-apps/api/tauri';
	import { createEventDispatcher, tick } from 'svelte';

	type EventMap = { targetchange: { path: string } };
	const dispatch = createEventDispatcher<EventMap>();
	export let images: string[];
	export let target: string | undefined = undefined;
	let container: HTMLElement | null = null;

	$: target &&
		tick().then(() => {
			container
				?.querySelector('[aria-checked=true]')
				?.scrollIntoView({ behavior: 'smooth', inline: 'center' });
		});
	const onPrev = () => {
		const index = images.findIndex((p) => target === p) - 1;
		console.log({ index });
		dispatch('targetchange', {
			path: index >= 0 ? images[index % images.length] : images[0],
		});
	};
	const onNext = () => {
		const index = images.findIndex((p) => target === p) + 1;
		console.log({ index });
		dispatch('targetchange', {
			path: index >= 0 ? images[index % images.length] : images[0],
		});
	};
</script>

<ul bind:this={container}>
	{#each images as image (image)}
		<li>
			<img
				src={convertFileSrc(image)}
				alt={image}
				aria-checked={target === image}
				role="radio"
			/>
		</li>
	{/each}
</ul>
<button class="prev" on:click={onPrev}>&lt;</button>
<button class="next" on:click={onNext}>&gt;</button>

<style>
	ul {
		display: flex;
		height: 100%;
		width: 100%;
		overflow-x: auto;
		scroll-snap-type: inline mandatory;
	}
	li {
		flex-shrink: 0;
		flex-grow: 0;
		height: 100%;
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		scroll-snap-align: center;
	}
	button {
		display: flex;
		height: 100%;
	}
	img {
		object-fit: contain;
		max-width: 100%;
		max-height: 100%;
	}
	button {
		position: fixed;
		top: 0;
		height: 100%;
		color: white;
	}
	button.prev {
		left: 0;
	}
	button.next {
		right: 0;
	}
</style>
