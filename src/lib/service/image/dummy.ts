import type { ImageController } from './types';

export class DummyImageController implements ImageController {
	async getIdList(): Promise<string[]> {
		return [];
	}
	async getUrl(): Promise<string> {
		throw new Error('Method not implemented.');
	}
	async getData(): Promise<Uint8Array> {
		throw new Error('Method not implemented.');
	}
	onUpdate() {
		// noop
	}
	dispose(): void {
		// noop
	}
}
