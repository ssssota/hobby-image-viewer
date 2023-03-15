// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface Platform {}
	}
}

// https://github.com/uhyo/better-typescript-lib/blob/5ccaad358d8495528186acd8dcf88f38283cf55b/generated/lib.es2017.object.d.ts
interface ObjectConstructor {
	values<T>(o: ArrayLike<T>): T[];
	values<K extends PropertyKey, V>(o: Record<K, V>): V[];
	values(o: object): unknown[];
	entries<T>(o: ArrayLike<T>): [string, T][];
	entries<K extends PropertyKey, V>(o: Record<K, V>): [string, V][];
	entries(o: object): [string, unknown][];
	getOwnPropertyDescriptors<T extends object>(
		o: T
	): {
		[P in keyof T]: TypedPropertyDescriptor<T[P]>;
	} & {
		[x: PropertyKey]: PropertyDescriptor;
	};
}

export {};
