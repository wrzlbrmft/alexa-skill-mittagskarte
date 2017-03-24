import { AbstractMap } from "./AbstractMap";

export class NumberMap<T> extends AbstractMap<T> {
	protected items: { [key: number]: T } = {};

	public constructor() {
		super();
	}
}
