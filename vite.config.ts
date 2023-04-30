import { svelte } from '@sveltejs/vite-plugin-svelte';
import typedotenv from 'unplugin-typedotenv/vite';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
	plugins: [
		typedotenv({ output: 'src/lib/env.ts', envObject: 'import.meta.env' }),
		svelte(),
		tsconfigPaths(),
	],
	envPrefix: ['TAURI_'],
});
