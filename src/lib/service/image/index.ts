import type { Readable } from 'svelte/store';
import { writable } from 'svelte/store';
import { BrowserImageController } from './browser';
import { DummyImageController } from './dummy';
import { TauriImageController } from './tauri';
import type { ImageController } from './types';
import { TAURI_ARCH } from '$lib/env';

type ImageStore = Readable<ImageController>;

const createImageStore = (init: ImageController): ImageStore => {
	const { subscribe, update } = writable<ImageController>(init);
	init.onUpdate(() => update((c) => c));
	return { subscribe };
};
const controller = TAURI_ARCH
	? new TauriImageController()
	: new BrowserImageController();
export const image = createImageStore(controller);
