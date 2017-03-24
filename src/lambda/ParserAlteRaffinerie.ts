import { AbstractParser } from "./AbstractParser";
import { Weekday } from "./Weekday";
import { MenuDay } from "./MenuDay";

export class ParserAlteRaffinerie extends AbstractParser {
	public constructor() {
		super();
	}

	public parseMenuDay(weekday: Weekday): MenuDay {
		return new MenuDay();
	}
}
