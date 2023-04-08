import * as exifr from 'exifr';

export const parseSdParameters = (
	parameters: string
): Record<string, string> => {
	if (!parameters) return {};
	const lines = parameters.split('\n');
	const lastLine = lines.pop();
	const params = Object.fromEntries(
		lastLine?.split(',')?.flatMap((line) => {
			const matched = line.match(/^\s*(.+)\s*:\s*(.+)\s*$/);
			if (matched === null) return [];
			return [[matched[1], matched[2]]] as const;
		}) ?? []
	);
	const [positive, ...negative] = lines.join('\n').split(/\nNegative prompt: /);
	return {
		...params,
		PositivePrompt: positive,
		NegativePrompt: negative.join('\n'),
	};
};

type Options = {
	extractSdParameters?: boolean;
};

export const loadExif = async (data: Uint8Array, options: Options) => {
	const result = await exifr.parse(data, true);
	if (!options.extractSdParameters) return result;

	const params = result.parameters;
	const sdParams = parseSdParameters(params);
	return { ...result, parameters: undefined, ...sdParams };
};
