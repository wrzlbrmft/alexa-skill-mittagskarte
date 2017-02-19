import { AbstractParser } from "./AbstractParser";
import { MenuDay } from "./MenuDay";
import { Weekday } from "./Weekday";
import { MenuWeek } from "./MenuWeek";

export class ParserExample extends AbstractParser {
	public constructor(html?: string) {
		super(html);
	}

	public parseMenuDay(weekday: Weekday): MenuDay {
		return null;
	}

	public parseMenuWeek(): MenuWeek {
		return null;
	}
}
