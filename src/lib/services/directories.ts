import { open } from '@tauri-apps/api/dialog';
import type { Readable } from 'svelte/store';
import { writable } from 'svelte/store';

type DirectoriesStore = Readable<string[]> & {
	open: (...target: string[]) => Promise<void>;
	close: () => Promise<void>;
};
const createDirectoriesStore = (): DirectoriesStore => {
	const { subscribe, set } = writable<string[]>([]);
	return {
		subscribe,
		async open(...target: string[]) {
			const dirs =
				target.length > 0
					? target
					: await open({
							title: 'Open Folder',
							directory: true,
							multiple: true,
					  });
			if (!Array.isArray(dirs)) return;
			set(dirs);
		},
		async close() {
			set([]);
		},
	};
};
export const directories = createDirectoriesStore();
