<script lang="ts">
	import * as List from '$lib/components/views/List.svelte';
	import * as Slide from '$lib/components/views/Slide.svelte';
	import { files } from '$lib/services/files';
	import { target } from '$lib/services/target';
	import type { ComponentType, SvelteComponentTyped } from 'svelte';
	type View = {
		default: ComponentType<SvelteComponentTyped<{ images: string[] }>>;
		viewName: string;
	};

	const views = [List, Slide] as const satisfies readonly View[];
	const viewMap = Object.fromEntries(
		views.map((Comp) => [Comp.viewName, Comp.default])
	);
	let view = Slide.viewName;

	const onTargetChange = (ev: CustomEvent<{ path: string }>) => {
		target.set(ev.detail.path);
	};
</script>

<svelte:component
	this={viewMap[view]}
	images={$files}
	target={$target?.path}
	on:targetchange={onTargetChange}
/>

<style>
</style>
