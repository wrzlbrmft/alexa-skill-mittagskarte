export class NumberMap<T> {
	private map: { [key: number]: T } = {};

	public constructor() {}

	public getMap(): { [key: number]: T } {
		return this.map;
	}

	public setMap(map: { [key: number]: T }): void {
		this.map = map;
	}

	public get(key: number): T {
		return this.map[key];
	}

	public put(key: number, value: T): void {
		this.map[key] = value;
	}
}
