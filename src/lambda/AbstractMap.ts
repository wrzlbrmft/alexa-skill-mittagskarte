export abstract class AbstractMap<T> {
	protected items = {};

	public constructor() {}

	public getAll() {
		return this.items;
	}

	public setAll(items): void {
		this.items = items;
	}

	public get(key: number | string): T {
		return this.items[key];
	}

	public put(key: number | string, value: T): void {
		this.items[key] = value;
	}
}
