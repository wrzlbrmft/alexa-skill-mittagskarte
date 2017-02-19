import { StringMap } from "./StringMap";

export class MultiStringMap<T> extends StringMap<T> {
	public constructor() {
		super();
	}

	public multiPut(keys: Array<string>, value: T) {
		for (let key of keys) {
			this.put(key, value);
		}
	}
}
