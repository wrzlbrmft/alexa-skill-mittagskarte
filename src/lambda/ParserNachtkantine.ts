import { AbstractParser } from "./AbstractParser";
import { MenuWeek } from "./MenuWeek";

export class ParserNachtkantine extends AbstractParser {
	public constructor(html?: string) {
		super(html);
	}

	public parse(): MenuWeek {
		return new MenuWeek();
	}
}
