import { Weekday, weekdays } from "./Weekday";
import { Menu } from "./Menu";
import { WeeklyMenu } from "./WeeklyMenu";

import * as winston from "winston";
import * as moment from "moment";

export abstract class AbstractParser {
	protected logger = new winston.Logger({
		level: process.env.LOG_LEVEL || "info",
		transports: [
			new winston.transports.Console({
				label: "AbstractParser"
			})
		]
	});

	private html: string = undefined;

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
		this.logger.debug("parsing start date");
		let startDate: string = this.parseStartDate();
		if (startDate) {
			this.logger.debug("start date => '%s'", startDate);

			let weeklyMenu: WeeklyMenu = new WeeklyMenu(startDate);
			weekdays.forEach((weekday: number) => {
				this.logger.debug("parsing day (weekday=%d('%s'))", weekday, weekdays.get(weekday));
				let day: Array<Menu> = this.parseDay(weekday);
				if (day) {
					if (day.length) {
						this.logger.debug("%d menu(s) on day", day.length);

						try {
							this.logger.debug("calculating date of day");
							let date: string =
								moment(weeklyMenu.getStartDate()).add(weekday - 1, "days").format("YYYY-MM-DD");
							this.logger.debug("date of day => '%s'", date);

							this.logger.debug("adding day to weekly menu (date='%s', menu(s)=%j)", date, day);
							weeklyMenu.getDays().put(date, day);
						}
						catch (e) {
							this.logger.error("error calculating date of day (%s)", e.toString());
						}
					}
					else {
						this.logger.warn("no menu(s) on day")
					}
				}
				else {
					this.logger.error("error parsing day");
				}
			});

			return weeklyMenu;
		}
		else {
			this.logger.error("error parsing start date");
		}

		return undefined;
	}
}
