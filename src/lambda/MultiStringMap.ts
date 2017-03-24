import { StringMap } from "./StringMap";

export class MultiStringMap<T> extends StringMap<T> {
	public constructor() {
		super();
	}

	public multiPut(keys: Array<string>, value: T): void {
		keys.forEach((key: string) => {
			this.put(key, value);
		});
	}
}
