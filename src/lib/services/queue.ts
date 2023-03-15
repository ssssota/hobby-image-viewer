import 'requestidlecallback-polyfill';

export const createQueue = () => {
	const q: (() => unknown)[] = [];
	return async <T>(task: () => Promise<T>): Promise<T> =>
		new Promise<T>((resolve) => {
			const callback = () =>
				requestIdleCallback(async () => {
					const result = await task();
					resolve(result);
					q.shift();
					q.at(0)?.();
				});
			q.push(callback);
			if (q.length === 1) callback();
		});
};
export const queue = createQueue();
