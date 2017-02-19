import { AbstractParser } from "./AbstractParser";
import { MenuDay } from "./MenuDay";
import { Weekday } from "./Weekday";
import { MenuWeek } from "./MenuWeek";

export class ParserCrowns extends AbstractParser {
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
