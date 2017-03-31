import { AbstractParser } from "./AbstractParser";
import { Weekday, weekdays } from "./Weekday";
import { Menu } from "./Menu";

import * as winston from "winston";
import * as cheerio from "cheerio";
import * as S from "string";
import * as moment from "moment";

export class ParserNachtkantine extends AbstractParser {
	protected logger = new winston.Logger({
		level: process.env.LOG_LEVEL || "info",
		transports: [
			new winston.transports.Console({
				label: "ParserNachtkantine"
			})
		]
	});

	public constructor(html?: string) {
		super(html);
	}

	public parseStartDate(): string {
		try {
			let startDate: string = undefined;
			let $ = cheerio.load(this.getHtml());

			$("h4").each((index, element) => {
				let text: string = $(element).text().replace(/(\r?\n|\r)/g, " "); // remove newlines
				let textString = S(text).trim(); // trim

				this.logger.silly("found potential start date => '%s'", textString.s);

				if (0 == textString.s.toLowerCase().indexOf("montag, ")) {
					let startDateString = textString.between("ontag, ");
					this.logger.debug("found start date string => '%s'", startDateString.s);

					let format: string = "D. MMMM";
					this.logger.debug("converting to date (format='%s')", format);
					try {
						let startDateMoment = moment(startDateString.trim().s, format, "de");
						startDate = startDateMoment.format("YYYY-MM-DD");
						this.logger.debug("date => '%s'", startDate);
					}
					catch (e) {
						this.logger.error("error converting to date (%s)", e.toString());
					}
				}
			});

			return startDate;
		}
		catch (e) {
			this.logger.error("error parsing start date (%s)", e.toString());
		}

		return undefined;
	}

	public parseDay(weekday: Weekday): Array<Menu> {
		try {
			let day: Array<Menu> = [];
			let $ = cheerio.load(this.getHtml());

			let isWeekday: boolean = false;
			$("span,h4").each((index, element) => {
				let text: string = $(element).text().replace(/(\r?\n|\r)/g, " "); // remove newlines
				let textString = S(text).trim(); // trim

				if ("span" == element.name.toLowerCase()) {
					if (isWeekday) {
						let menuNameString = textString
							.replaceAll("&", "und")	// use "und" instead of "&"
							.replaceAll("„", "\"")	// use regular quotes instead of typographic quotes
							.replaceAll("“", "\"")	// use regular quotes instead of typographic quotes
							.collapseWhitespace();	// collapse whitespace

						if (!menuNameString.isEmpty()) {
							this.logger.debug("found menu => '%s'", menuNameString.s);
							day.push(new Menu(menuNameString.s));
						}
					}
				}

				if ("h4" == element.name.toLowerCase()) {
					this.logger.silly("found potential weekday => '%s'", textString.s);

					if (0 == textString.s.toLowerCase().indexOf(weekdays.get(weekday).toLowerCase())) {
						this.logger.debug("found beginning of weekday ('%s')", textString.s);
						isWeekday = true;
					}
					else {
						if (isWeekday) {
							this.logger.debug("found end of weekday");
						}
						isWeekday = false;
					}
				}
			});

			return day;
		}
		catch (e) {
			this.logger.error("error parsing day (%s)", e.toString());
		}

		return undefined;
	}
}
