<script lang="ts">
	import { image } from '$lib/service/image';
	import type { Snapshot } from './$types';

	export const snapshot: Snapshot<number> = {
		capture: () => window.scrollY,
		restore: (scrollY) => window.scrollTo({ top: scrollY }),
	};
</script>

{#await $image.getIdList()}
	loading...
{:then idList}
	<ul>
		{#each idList as id (id)}
			<li>
				{#await $image.getUrl(id) then url}
					<img src={url} alt="" class="thumbnail" loading="lazy" />
				{/await}
				<a href="/image/{encodeURIComponent(id)}">
					{id}
				</a>
			</li>
		{/each}
	</ul>
{:catch e}
	{e instanceof Error ? e.message : e}
{/await}

<style>
	.thumbnail {
		height: 1em;
	}
</style>
