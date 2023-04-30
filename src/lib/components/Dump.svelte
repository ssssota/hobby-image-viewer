<script lang="ts">
	export let key: string;
	export let value: any;
</script>

{#if typeof value === 'bigint' || typeof value === 'boolean' || typeof value === 'number' || typeof value === 'string' || value === null}
	<div>
		<span class="key">{key}</span>:
		<span class="value">{`${value}`.trim()}</span>
	</div>
{:else if ArrayBuffer.isView(value)}
	<div>
		<span class="key">{key}</span>:
		<span class="value">{value.constructor.name} [{value.byteLength}]</span>
	</div>
{:else if typeof value === 'object'}
	<div>
		<span class="key">{key}</span>:
		<span class="value">
			<ul>
				{#each Object.entries(value) as [k, v] (k)}
					<li><svelte:self key={k} value={v} /></li>
				{/each}
			</ul>
		</span>
	</div>
{/if}

<style>
	.key {
		font-weight: bold;
		white-space: normal;
	}
	.value {
		white-space: normal;
	}
	ul {
		padding-left: 1em;
	}
</style>
