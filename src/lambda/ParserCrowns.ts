import { AbstractParser } from "./AbstractParser";
import { Weekday } from "./Weekday";
import { Menu } from "./Menu";

export class ParserCrowns extends AbstractParser {
	public constructor(html?: string) {
		super(html);
	}

	public parseStartDate(): string {
		return "YYYY-MM-DD";
	}

	public parseDay(weekday: Weekday): Array<Menu> {
		let day: Array<Menu> = [];

		// ...

		return day;
	}
}
