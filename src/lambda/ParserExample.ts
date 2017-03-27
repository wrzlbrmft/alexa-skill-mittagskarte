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

	public parseDay(weekday: Weekday): Array<Menu> {
		let day: Array<Menu> = [];
		for (let i: number = 0; i < 3; i++) {
			day.push(new Menu(`Menü ${i} am ${weekdays.get(weekday)}`));
		}

		return day;
	}
}
