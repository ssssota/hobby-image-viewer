import { browser } from '$app/environment';
import { TAURI_ARCH } from '$env/static/public';
import type { Readable } from 'svelte/store';
import { writable } from 'svelte/store';
import { DummyImageController } from './dummy';
import { TauriImageController } from './tauri';
import type { ImageController } from './types';

type ImageStore = Readable<ImageController>;

const createImageStore = (init: ImageController): ImageStore => {
	const { subscribe, update } = writable<ImageController>(init);
	init.onUpdate(() => update((c) => c));
	return { subscribe };
};
export const image = createImageStore(
	browser && !!TAURI_ARCH
		? new TauriImageController()
		: new DummyImageController()
);
