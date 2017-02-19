import { AbstractParser } from "./AbstractParser";
import { MenuWeek } from "./MenuWeek";
import { MenuDay } from "./MenuDay";
import { Weekday } from "./Weekday";

export class ParserNachtkantine extends AbstractParser {
	public constructor(html?: string) {
		super(html);
	}


	public parseMenuWeek(): MenuWeek {
		return null;
	}

	public parseMenuDay(weekday: Weekday): MenuDay {
		return null;
	}
}
