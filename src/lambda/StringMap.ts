export class StringMap<T> {
	private map: { [key: string]: T };

	public constructor() {}

	public getMap(): { [key: string]: T } {
		return this.map;
	}

	public setMap(map: { [key: string]: T }): void {
		this.map = map;
	}

	public get(key: string): T {
		return this.map[key];
	}

	public put(key: string, value: T): void {
		this.map[key] = value;
	}
}
