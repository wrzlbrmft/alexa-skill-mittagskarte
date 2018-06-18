import { StringMap } from "./StringMap";

export class MultiStringMap<V> extends StringMap<V> {
    public constructor() {
        super();
    }

    public multiPut(keys: Array<string>, value: V): void {
        keys.forEach((key: string) => {
            this.put(key, value);
        });
    }
}
