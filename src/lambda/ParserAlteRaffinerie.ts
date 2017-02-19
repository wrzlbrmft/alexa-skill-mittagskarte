import { AbstractParser } from "./AbstractParser";
import { MenuWeek } from "./MenuWeek";
import { Weekday } from "./Weekday";
import { MenuDay } from "./MenuDay";

export class ParserAlteRaffinerie extends AbstractParser {
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
