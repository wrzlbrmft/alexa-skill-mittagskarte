export class List<T> {
	private items: Array<T> = [];

	public constructor(...items: Array<T>) {
		this.setAll(items);
	}

	public getAll(): Array<T> {
		return this.items;
	}

	public setAll(items: Array<T>): void {
		this.items = items;
	}

	public add(...items: Array<T>): void {
		this.items.push(...items);
	}
}
