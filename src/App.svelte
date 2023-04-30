<script lang="ts">
	import Router from 'svelte-spa-router';
	import Layout from './routes/+layout.svelte';
	import Home from './routes/+page.svelte';
	import Viewer from './routes/image/[id]/+page.svelte';
	const routes = {
		'/': Home,
		'/image/:id': Viewer,
	};
</script>

<Layout>
	<Router {routes} />
</Layout>

<style>
</style>
