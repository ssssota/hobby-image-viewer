<script lang="ts">
	import { directories } from '$lib/services/directories';
	import { listen, TauriEvent } from '@tauri-apps/api/event';
	import { onMount } from 'svelte';
	import 'the-new-css-reset/css/reset.css';
	onMount(() => {
		const unsubscribeFunctionPromises = [
			listen<string>(TauriEvent.MENU, (ev) => {
				switch (ev.payload) {
					case 'open-dir':
						directories.open();
						break;
				}
			}),
			listen<string[]>(TauriEvent.WINDOW_FILE_DROP, (ev) => {
				directories.open(...ev.payload);
			}),
		];
		return () => {
			Promise.all(unsubscribeFunctionPromises).then((unsubscribeFunctions) =>
				unsubscribeFunctions.forEach((unsubscribe) => unsubscribe())
			);
		};
	});
</script>

<main>
	<slot />
</main>

<style>
	:root {
		--bg-color: #111113;
	}
	:global(:where(html, body)) {
		height: 100%;
		background-color: var(--bg-color);
	}
	main {
		height: 100%;
	}
</style>
