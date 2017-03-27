import { Weekday, weekdays } from "./Weekday";
import { Menu } from "./Menu";
import { WeeklyMenu } from "./WeeklyMenu";

export abstract class AbstractParser {
	private html: string;

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

	public abstract parseDailyMenus(weekday: Weekday): Array<Menu>;

	public parseWeeklyMenu(): WeeklyMenu {
		let weeklyMenu: WeeklyMenu = new WeeklyMenu(this.parseStartDate());
		weekdays.forEach((key: number) => {
			weeklyMenu.getDailyMenus().put(key, this.parseDailyMenus(key));
		});

		return weeklyMenu;
	}
}
