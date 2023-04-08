import type { FileEntry } from '@tauri-apps/api/fs';
import type { ImageController } from './types';

const stateKey = 'hiver-tauri-images';

export class TauriImageController implements ImageController {
	private mod = import('@tauri-apps/api');
	private disposer: (() => unknown)[] = [];
	private paths: string[] = [];
	private callbacks: Set<() => unknown> = new Set();

	constructor() {
		this.restoreState();
		this.start();
	}

	async getIdList(): Promise<string[]> {
		return this.paths;
	}
	async getUrl(id: string): Promise<string> {
		const api = await this.mod;
		return api.tauri.convertFileSrc(id);
	}
	async getData(id: string): Promise<Uint8Array> {
		const api = await this.mod;
		return await api.fs.readBinaryFile(id);
	}
	onUpdate(callback: () => unknown) {
		this.callbacks.add(callback);
	}
	dispose(): void {
		this.disposer.forEach((dispose) => dispose());
		this.disposer = [];
		this.callbacks.clear();
	}

	private async start() {
		const api = await this.mod;
		const unlistenFunctions = await Promise.all([
			api.event.listen<string>(api.event.TauriEvent.MENU, (ev) => {
				switch (ev.payload) {
					case 'open-dir':
						this.openDirecotries().then((dirs) => this.loadPaths(dirs));
						break;
				}
			}),
			api.event.listen<string[]>(
				api.event.TauriEvent.WINDOW_FILE_DROP,
				(ev) => {
					this.loadPaths(ev.payload);
				}
			),
		]);
		this.disposer.push(...unlistenFunctions);
	}
	private async openDirecotries() {
		const api = await this.mod;
		const directories = await api.dialog.open({
			title: 'Open Folder',
			directory: true,
			multiple: true,
		});
		if (!Array.isArray(directories)) return [];
		return directories;
	}
	private async loadPaths(paths: string[]) {
		const api = await this.mod;
		const fileEntries = await Promise.all(
			paths.map(async (path) => {
				const entries = await api.fs.readDir(path, { recursive: true }).catch(
					() => [{ name: '.', path }] satisfies FileEntry[] // handle if path is not directory
				);
				return { path, entries } as const;
			})
		);
		const resolvedPaths = await Promise.all(
			fileEntries.map(({ path, entries }) =>
				this.traverseFileEntry(path, entries)
			)
		).then((pathsList) => pathsList.flat());
		this.paths = resolvedPaths;
		this.notifyUpdate();
	}
	/**
	 * @param baseDir base directory path
	 * @param entries file or directory name list
	 * @returns fullpath of files in the dir
	 */
	private async traverseFileEntry(
		baseDir: string,
		entries: FileEntry[]
	): Promise<string[]> {
		const api = await this.mod;
		return Promise.all(
			entries.map(async (entry) => {
				if (!entry.name) return [];
				const path = await api.path.join(baseDir, entry.name);
				if (entry.children) return this.traverseFileEntry(path, entry.children);
				return path;
			})
		).then((e) => e.flat());
	}
	private notifyUpdate() {
		this.saveState();
		this.callbacks.forEach((callback) => callback());
	}

	private saveState() {
		window.sessionStorage.setItem(stateKey, JSON.stringify(this.paths));
	}
	private restoreState() {
		try {
			this.paths = JSON.parse(window.sessionStorage.getItem(stateKey) ?? '[]');
		} catch (e) {
			console.warn(e);
		}
	}
}
