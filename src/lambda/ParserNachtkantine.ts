import { AbstractParser } from "./AbstractParser";
import { Weekday } from "./Weekday";
import { Menu } from "./Menu";

export class ParserNachtkantine extends AbstractParser {
	public constructor(html?: string) {
		super(html);
	}

	public parseStartDate(): string {
		return "yyyy-mm-dd";
	}

	public parseDailyMenus(weekday: Weekday): Array<Menu> {
		let dailyMenus: Array<Menu> = [];

		// ...

		return dailyMenus;
	}
}
