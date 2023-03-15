import type { FileEntry } from '@tauri-apps/api/fs';
import { readDir } from '@tauri-apps/api/fs';
import { join } from '@tauri-apps/api/path';
import { derived, writable, type Readable } from 'svelte/store';
import { directories } from './directories';

/**
 * flatten paths
 * @param dir base directory path
 * @param entries files or directories
 * @returns fullpath of files in the dir
 */
const traverse = async (
	dir: string,
	entries: FileEntry[]
): Promise<string[]> => {
	return Promise.all(
		entries.map(async (entry) => {
			if (!entry.name) return [];
			const path = await join(dir, entry.name);
			if (entry.children) return traverse(path, entry.children);
			return path;
		})
	).then((e) => e.flat());
};

const _filesLoadError = writable<string | undefined>();
const _filesLoading = writable(false);
export const files = derived<typeof directories, string[]>(
	directories,
	(dirs, set) => {
		_filesLoading.set(true);
		Promise.all(
			dirs.map((dir) => {
				return Promise.all([
					dir,
					readDir(dir, { recursive: true }).catch(
						() => [{ name: '.', path: dir }] satisfies FileEntry[] // load as file
					),
				]);
			})
		)
			.then((dirEntries) => {
				return Promise.all(
					dirEntries.map(([dir, entries]) => traverse(dir, entries))
				);
			})
			.then((entries) => Array.from(new Set(entries.flat())))
			.catch((e) => {
				_filesLoadError.set(e instanceof Error ? e.message : `${e}`);
				return [];
			})
			.then(set)
			.finally(() => _filesLoading.set(false));
	},
	[]
);
export const filesLoading: Readable<boolean> = _filesLoading;
