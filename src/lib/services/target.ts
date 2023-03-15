import type { Readable } from 'svelte/store';
import { writable } from 'svelte/store';

type TargetState = {
	path: string;
};
type TargetStore = Readable<TargetState | undefined> & {
	set: (path: string) => void;
};
const createTargetStore = (): TargetStore => {
	const { subscribe, set } = writable<TargetState | undefined>();
	return {
		subscribe,
		set: (path: string) => {
			set({ path });
		},
	};
};
export const target = createTargetStore();
