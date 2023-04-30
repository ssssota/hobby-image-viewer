<script lang="ts">
	import { image } from '$lib/service/image';
	import type { Snapshot } from './$types';
	import { link } from 'svelte-spa-router';

	export const snapshot: Snapshot<number> = {
		capture: () => window.scrollY,
		restore: (scrollY) => window.scrollTo({ top: scrollY }),
	};
</script>

{#await $image.getIdList()}
	loading...
{:then idList}
	{#if idList.length === 0}
		<p>Drop image</p>
	{:else}
		<ul>
			{#each idList as id (id)}
				<li>
					{#await $image.getUrl(id) then url}
						<img src={url} alt="" class="thumbnail" loading="lazy" />
					{/await}
					<a href="/image/{encodeURIComponent(id)}" use:link>
						{id}
					</a>
				</li>
			{/each}
		</ul>
	{/if}
{:catch e}
	{e instanceof Error ? e.message : e}
{/await}

<style>
	.thumbnail {
		height: 1em;
	}
</style>
