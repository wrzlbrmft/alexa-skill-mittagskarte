import { AbstractParser } from "./AbstractParser";
import { Weekday, weekdays } from "./Weekday";
import { Menu } from "./Menu";

export class ParserExample extends AbstractParser {
	public constructor(html?: string) {
		super(html);
	}

	public parseStartDate(): string {
		return "yyyy-mm-dd";
	}

	public parseDailyMenus(weekday: Weekday): Array<Menu> {
		let dailyMenus: Array<Menu> = [];
		for (let i: number = 0; i < 3; i++) {
			dailyMenus.push(new Menu(`Menü ${i} am ${weekdays.get(weekday)}`));
		}

		return dailyMenus;
	}
}
