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
		return moment().day(Weekday.Monday).format("YYYY-MM-DD");
	}

	public parseDay(weekday: Weekday): Array<Menu> {
		let day: Array<Menu> = [];
		for (let i: number = 0; i < 3; i++) {
			day.push(new Menu(`Menü ${i + 1} am ${weekdays.get(weekday)}`));
		}

		return day;
	}
}
