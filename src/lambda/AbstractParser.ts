import { Weekday, weekdays } from "./Weekday";
import { Menu } from "./Menu";
import { WeeklyMenu } from "./WeeklyMenu";

import * as moment from "moment";

export abstract class AbstractParser {
	private html: string = "";

	public constructor(html?: string) {
		if (html) {
			this.setHtml(html);
		}
	}

	public getHtml(): string {
		return this.html;
	}

	public setHtml(html: string): void {
		this.html = html;
	}

	public abstract parseStartDate(): string;

	public abstract parseDay(weekday: Weekday): Array<Menu>;

	public parseWeeklyMenu(): WeeklyMenu {
		let weeklyMenu: WeeklyMenu = new WeeklyMenu(this.parseStartDate());
		let keyMoment = moment(weeklyMenu.getStartDate());
		weekdays.forEach((key: number) => {
			let day: Array<Menu> = this.parseDay(key);
			if (day.length) {
				weeklyMenu.getDays().put(keyMoment.add(key - 1, "days").format("YYYY-MM-DD"), day);
			}
		});

		return weeklyMenu;
	}
}
