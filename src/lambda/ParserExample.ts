import { AbstractParser } from "./AbstractParser";

export class ParserExample extends AbstractParser {
	public constructor(html?: string) {
		super(html);
	}

	public parse(): void {}
}
