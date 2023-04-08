import { image } from '$lib/service/image';
import { get } from 'svelte/store';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params }) => {
	return {
		id: params.id,
		url: get(image)
			.getUrl(params.id)
			.catch(() => ''),
	};
};
