import { AbstractParser } from "./AbstractParser";
import { MenuDay } from "./MenuDay";
import { Weekday } from "./Weekday";

export class ParserNachtkantine extends AbstractParser {
	public constructor(html?: string) {
		super(html);
	}

	public parseMenuDay(weekday: Weekday): MenuDay {
		return new MenuDay();
	}
}
