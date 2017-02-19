import { MenuDay } from "./MenuDay";
import { Weekday } from "./Weekday";
import { MenuWeek } from "./MenuWeek";

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

	public abstract parseMenuDay(weekday: Weekday): MenuDay;

	public abstract parseMenuWeek(): MenuWeek;
}
