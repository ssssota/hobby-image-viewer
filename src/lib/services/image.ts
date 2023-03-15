import { parse } from 'exifr';

export const loadMetadata = (image: HTMLImageElement) => {
	return parse(image);
};

export const parseSdParameters = (parameters: string) => {
	const lines = parameters.split('\n');
	const lastLine = lines.pop();
	const params = Object.fromEntries(
		lastLine
			?.split(',')
			?.flatMap((line) => {
				const trimed = line.trim();
				return trimed === '' ? [] : [trimed];
			})
			?.map((line) => {
				const [k, v] = line.split(':');
				return [k.trim(), v.trim()] as const;
			}) ?? []
	);
	const [positive, ...negative] = lines.join('\n').split(/\nNegative prompt: /);
	return { ...params, positive, negative: negative.join('\n') };
};
