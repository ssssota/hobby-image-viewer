import { invoke } from '@tauri-apps/api/tauri';

export const readImageMetadata = (path: string) => {
	invoke('read_image_metadata', { path }).then((res) => console.log(res));
};
