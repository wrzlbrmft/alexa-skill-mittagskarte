import { AbstractMap } from "./AbstractMap";

export class NumberMap<V> extends AbstractMap<V> {
    protected values: { [key: number]: V } = {};

    public constructor() {
        super();
    }

    public forEach(callback: (key: number, value?: V) => void): void {
        super.forEach(callback);
    }
}
