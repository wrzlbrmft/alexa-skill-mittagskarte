import { Weekday } from "./Weekday";
import { MenuDay } from "./MenuDay";
import { MenuWeek } from "./MenuWeek";

export abstract class AbstractParser {
	private html: string;

	public constructor() {}

	public getHtml(): string {
		return this.html;
	}

	public setHtml(html: string): void {
		this.html = html;
	}

	public abstract parseMenuDay(weekday: Weekday): MenuDay;

	public parseMenuWeek(): MenuWeek {
		let menuWeek: MenuWeek = new MenuWeek();
		for (let weekday: number = Weekday.Monday; weekday <= Weekday.Friday; weekday++) {
			menuWeek.put(weekday, this.parseMenuDay(weekday));
		}

		return menuWeek;
	}
}
