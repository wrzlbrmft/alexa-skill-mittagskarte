import { AbstractMap } from "./AbstractMap";

export class StringMap<T> extends AbstractMap<T> {
	protected items: { [key: string]: T } = {};

	public constructor() {
		super();
	}
}
