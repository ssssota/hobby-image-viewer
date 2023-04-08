export interface ImageController {
	getIdList(): Promise<string[]>;
	getUrl(id: string): Promise<string>;
	getData(id: string): Promise<Uint8Array>;
	onUpdate(callback: () => unknown): unknown;
	dispose(): void;
}
