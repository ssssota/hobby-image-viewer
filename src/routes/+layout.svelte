<script lang="ts">
	import 'the-new-css-reset/css/reset.css';
</script>

<svelte:window on:contextmenu|preventDefault />

<slot />

<style>
	:root {
		--bg-color: #1e1e25;
		--color: #eeeeee;
		--unit: 4px;
	}
	:global(:where(html, body)) {
		min-height: 100vh;
		transition: all 0.2s 0s ease;
		background-color: var(--bg-color);
		color: var(--color);
		font-size: calc(var(--unit) * 4);
		user-select: none;
		-webkit-user-drag: none;
		font-family: Arial, Helvetica, sans-serif;
	}
</style>
