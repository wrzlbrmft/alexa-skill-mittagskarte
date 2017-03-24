import { AbstractParser } from "./AbstractParser";
import { Weekday, weekdays } from "./Weekday";
import { MenuDay } from "./MenuDay";
import { Menu } from "./Menu";

export class ParserExample extends AbstractParser {
	public constructor() {
		super();
	}

	public parseMenuDay(weekday: Weekday): MenuDay {
		let menuDay: MenuDay = new MenuDay();
		for (let i: number = 0; i < 3; i++) {
			menuDay.add(new Menu(`Menü ${i} am ${weekdays.get(weekday)}`));
		}

		return menuDay;
	}
}
