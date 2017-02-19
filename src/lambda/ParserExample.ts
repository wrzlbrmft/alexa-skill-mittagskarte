import { AbstractParser } from "./AbstractParser";
import { MenuDay } from "./MenuDay";
import { Weekday, weekdays } from "./Weekday";
import { MenuWeek } from "./MenuWeek";
import { Dish } from "./Dish";

export class ParserExample extends AbstractParser {
	public constructor(html?: string) {
		super(html);
	}

	public parseMenuDay(weekday: Weekday): MenuDay {
		let menuDay: MenuDay = new MenuDay();

		for (let i: number = 0; i < 3; i++) {
			menuDay.addDish(new Dish(`Menü ${i} am ${weekdays.get(weekday)}`));
		}

		return menuDay;
	}

	public parseMenuWeek(): MenuWeek {
		let menuWeek: MenuWeek = new MenuWeek();

		for (let weekday: number = Weekday.Monday; weekday <= Weekday.Friday; weekday++) {
			menuWeek.put(weekday, this.parseMenuDay(weekday));
		}

		return menuWeek;
	}
}
