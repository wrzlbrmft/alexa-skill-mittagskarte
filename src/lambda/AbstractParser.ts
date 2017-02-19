import { MenuWeek } from "./MenuWeek";
import { MenuDay } from "./MenuDay";
import { Weekday } from "./Weekday";

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

	public abstract parseMenuWeek(): MenuWeek;

	public abstract parseMenuDay(weekday: Weekday): MenuDay;
}
