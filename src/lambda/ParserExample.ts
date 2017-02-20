import { AbstractParser } from "./AbstractParser";
import { Weekday, weekdays } from "./Weekday";
import { MenuDay } from "./MenuDay";
import { Dish } from "./Dish";

export class ParserExample extends AbstractParser {
	public constructor(html?: string) {
		super(html);
	}

	public parse(): void {
		for (let weekday: number = Weekday.Monday; weekday <= Weekday.Friday; weekday++) {
			let menuDay: MenuDay = new MenuDay();

			for (let i: number = 1; i <= 3; i++) {
				menuDay.addDish(new Dish(`Menü ${i} am ${weekdays.get(weekday)}`));
			}

			this.getMenuWeek().put(weekday, menuDay);
		}
	}
}
