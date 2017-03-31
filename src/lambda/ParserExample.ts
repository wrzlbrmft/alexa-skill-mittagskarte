import { AbstractParser } from "./AbstractParser";
import { Weekday, weekdays } from "./Weekday";
import { Menu } from "./Menu";

import * as winston from "winston";
import * as moment from "moment";

export class ParserExample extends AbstractParser {
	protected logger = new winston.Logger({
		level: process.env.LOG_LEVEL || "info",
		transports: [
			new winston.transports.Console({
				label: "ParserExample"
			})
		]
	});

	public constructor(html?: string) {
		super(html);
	}

	public parseStartDate(): string {
		let startDate: string = undefined;

		let format: string = "YYYY-MM-DD";
		this.logger.debug("creating date for last monday (format='%s')", format);
		try {
			startDate = moment().day(Weekday.Monday).format(format);
			this.logger.debug("date => '%s'", startDate);
		}
		catch (e) {
			this.logger.error("error creating date for last monday (%s)", e.toString());
		}

		return startDate;
	}

	public parseDay(weekday: Weekday): Array<Menu> {
		let day: Array<Menu> = [];

		for (let i: number = 0; i < 3; i++) {
			let menuName: string = `Menü ${i + 1} am ${weekdays.get(weekday)}`;

			this.logger.debug("create menu => '%s'", menuName);
			day.push(new Menu(menuName));
		}

		return day;
	}
}
