import { AbstractMap } from "./AbstractMap";

export class StringMap<V> extends AbstractMap<V> {
	protected values: { [key: string]: V } = {};

	public constructor() {
		super();
	}

	public forEach(callback: (key: string, value?: V) => void): void {
		super.forEach(callback);
	}
}
