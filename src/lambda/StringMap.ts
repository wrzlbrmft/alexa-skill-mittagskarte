export class StringMap<T> {
	private items: { [key: string]: T } = {};

	public constructor() {}

	public getAll(): { [key: string]: T } {
		return this.items;
	}

	public setAll(items: { [key: string]: T }): void {
		this.items = items;
	}

	public get(key: string): T {
		return this.items[key];
	}

	public put(key: string, value: T): void {
		this.items[key] = value;
	}
}
