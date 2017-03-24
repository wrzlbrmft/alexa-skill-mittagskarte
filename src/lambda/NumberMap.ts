export class NumberMap<T> {
	private items: { [key: number]: T } = {};

	public constructor() {}

	public getAll(): { [key: number]: T } {
		return this.items;
	}

	public setAll(items: { [key: number]: T }): void {
		this.items = items;
	}

	public get(key: number): T {
		return this.items[key];
	}

	public put(key: number, value: T): void {
		this.items[key] = value;
	}
}
