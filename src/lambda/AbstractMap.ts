export abstract class AbstractMap<V> {
    protected values = {};

    public constructor() {}

    public get(key: number | string): V {
        return this.values[key];
    }

    public put(key: number | string, value: V): void {
        this.values[key] = value;
    }

    public forEach(callback: (key: number | string, value?: V) => void): void {
        for (let key in this.values) {
            callback(key, this.get(key));
        }
    }
}
