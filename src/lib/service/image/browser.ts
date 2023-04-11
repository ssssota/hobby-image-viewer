import type { ImageController } from './types';

export class BrowserImageController implements ImageController {
	private callbacks: Set<() => unknown> = new Set();
	private handlers: Map<'dragover' | 'drop', (e: DragEvent) => unknown> =
		new Map();
	private entries: Map<string, Uint8Array> = new Map();

	constructor() {
		this.start();
	}

	async getIdList(): Promise<string[]> {
		return Array.from(this.entries.keys());
	}
	async getUrl(id: string): Promise<string> {
		return URL.createObjectURL(new Blob([await this.getData(id)]));
	}
	async getData(id: string): Promise<Uint8Array> {
		const data = this.entries.get(id);
		if (!data) throw new Error('File not found');
		return data;
	}
	onUpdate(callback: () => unknown) {
		this.callbacks.add(callback);
	}
	dispose(): void {
		this.entries.clear();
		this.callbacks.clear();
		this.handlers.forEach((handler, event) => {
			window.document.body.removeEventListener(event, handler);
		});
	}

	private async start() {
		const onDragover = (e: DragEvent) => {
			e.preventDefault();
		};
		const onDrop = (e: DragEvent) => {
			e.preventDefault();
			const files = e.dataTransfer?.files;
			if (!files) return;
			this.loadFiles(files);
		};
		window.document.body.addEventListener('dragover', onDragover);
		window.document.body.addEventListener('drop', onDrop);
		this.handlers.set('dragover', onDragover);
		this.handlers.set('drop', onDrop);
	}
	private async loadFiles(files: FileList) {
		const entries = await Promise.allSettled(
			Array.from(files).map((file) => BrowserImageController.readFile(file))
		).then((results) => {
			return results.flatMap((result) => {
				if (result.status === 'fulfilled') return [result.value];
				console.error(result.reason);
				return [];
			});
		});
		entries.forEach(({ name, data }) => this.entries.set(name, data));
		this.notifyUpdate();
	}
	private notifyUpdate() {
		this.callbacks.forEach((callback) => callback());
	}

	private static async readFile(file: File) {
		return new Promise<{
			name: string;
			data: Uint8Array;
		}>((resolve, reject) => {
			const reader = new FileReader();
			reader.onload = () => {
				if (reader.result instanceof ArrayBuffer) {
					const data = new Uint8Array(reader.result as ArrayBuffer);
					resolve({ name: file.name, data });
				} else {
					reject(new Error('FileReader result is not ArrayBuffer'));
				}
			};
			reader.onerror = reject;
			reader.readAsArrayBuffer(file);
		});
	}
}
