import { AbstractParser } from "./AbstractParser";
import { Weekday, weekdays } from "./Weekday";
import { Menu } from "./Menu";

import * as winston from "winston";
import * as cheerio from "cheerio";
import * as S from "string";
import * as moment from "moment";

export class ParserAlterWirt extends AbstractParser {
	protected logger = new winston.Logger({
		level: process.env.LOG_LEVEL || "info",
		transports: [
			new winston.transports.Console({
				label: "ParserAlterWirt"
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

			$("table.contentpaneopen p").each((index, element) => {
				let text: string = $(element).text().replace(/(\r?\n|\r)/g, " "); // remove newlines
				let textString = S(text).trim(); // trim

				this.logger.silly("found potential start date => '%s'", textString.s);

				if (0 == textString.s.toLowerCase().indexOf("vom ")) {
					let startDateString = textString.between("vom ", " bis");
					this.logger.debug("found start date string => '%s'", startDateString.s);

					let format: string = "DD.MM.YYYY";
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
			$("table.contentpaneopen p,table.contentpaneopen strong").each((index, element) => {
				let text: string = $(element).text().replace(/(\r?\n|\r)/g, " "); // remove newlines
				let textString = S(text).trim(); // trim

				if ("p" == element.name.toLowerCase()) {
					if (isWeekday) {
						if (textString.startsWith("Gericht ") || textString.startsWith("Vegetarisch:")) {
							let menuNameString = textString
								.chompLeft("Gericht 1:")	// remove "Gericht 1:" at the beginning
								.chompLeft("Gericht 2:")	// remove "Gericht 2:" at the beginning
								.chompLeft("Vegetarisch:")	// remove "Vegetarisch:" at the beginning
								.trimLeft()
								.collapseWhitespace();	// collapse whitespace

							if (!menuNameString.isEmpty()) {
								this.logger.debug("found menu => '%s'", menuNameString.s);
								day.push(new Menu(menuNameString.s));
							}
						}
					}
				}

				if ("strong" == element.name.toLowerCase()) {
					if (!textString.isEmpty()) {
						this.logger.silly("found potential weekday => '%s'", textString.s);

						if (textString.strip("-").trim().s.toLowerCase() == weekdays.get(weekday).toLowerCase()) {
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
