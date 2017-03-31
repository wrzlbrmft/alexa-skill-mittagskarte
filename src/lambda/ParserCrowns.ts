import { AbstractParser } from "./AbstractParser";
import { Weekday, weekdays } from "./Weekday";
import { Menu } from "./Menu";

import * as winston from "winston";
import * as cheerio from "cheerio";
import * as S from "string";
import * as moment from "moment";

export class ParserCrowns extends AbstractParser {
	protected logger = new winston.Logger({
		level: process.env.LOG_LEVEL || "info",
		transports: [
			new winston.transports.Console({
				label: "ParserCrowns"
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

			$("#main-content p").each((index, element) => {
				let text: string = $(element).text().replace(/(\r?\n|\r)/g, " "); // remove newlines
				let textString = S(text).trim(); // trim

				this.logger.silly("found potential start date => '%s'", textString.s);

				if (0 == textString.s.toLowerCase().indexOf("in der woche von ")) {
					let startDateString = textString.between("oche von ", " –")
						.replaceAll("2016", "2017"); // fix wrong year
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
		let day: Array<Menu> = [];

		function addMenuToDay(menuName: string) {
			if (menuName) {
				let menuNameString = S(menuName)
					.decodeHTMLEntities()	// decode HTML entities
					.replaceAll("“", "\"")	// use regular quotes instead of typographic quotes
					.replaceAll("”", "\"")	// use regular quotes instead of typographic quotes
					.chompLeft("1.")		// remove "1." at the beginning
					.chompLeft("2.")		// remove "2." at the beginning
					.trimLeft()				// trim at the beginning
					.collapseWhitespace();	// collapse whitespace

				if (!menuNameString.isEmpty()) {
					this.logger.debug("found menu => '%s'", menuNameString.s);
					day.push(new Menu(menuNameString.s));
				}
			}
		}

		try {
			let $ = cheerio.load(this.getHtml());

			let isWeekday: boolean = false;
			let menuName: string = undefined;
			$("#main-content p,#main-content h3").each((index, element) => {
				let text: string = $(element).text().replace(/(\r?\n|\r)/g, " "); // remove newlines
				let textString = S(text).trim(); // trim

				if ("p" == element.name.toLowerCase()) {
					if (isWeekday) {
						if (
							textString.startsWith("1.") || textString.startsWith("2.")
							|| "oder" == textString.s.toLowerCase() || textString.isEmpty()
						) {
							// line starts a new menu or is a separator

							// just in case of a pending menu, try to add it
							addMenuToDay.call(this, menuName);
							menuName = "";

							if (!("oder" == textString.s.toLowerCase() || textString.isEmpty())) {
								// line is not a separator

								// start new menu
								menuName = textString.s;
							}
						}
						else {
							// line continues a pending menu (somebody hit ENTER inside a menu...)

							// append to pending menu
							menuName += (" " + textString.s);
						}
					}
				}

				if ("h3" == element.name.toLowerCase()) {
					if (isWeekday) {
						// just in case of a pending menu, try to add it
						addMenuToDay.call(this, menuName);
						menuName = "";
					}

					this.logger.silly("found potential weekday => '%s'", textString.s);

					if (textString.s.toLowerCase() == weekdays.get(weekday).toLowerCase()) {
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

			if (isWeekday) {
				// just in case of a pending menu, try to add it
				addMenuToDay.call(this, menuName);
				// menuName = "";
			}

			return day;
		}
		catch (e) {
			this.logger.error("error parsing day (%s)", e.toString());
		}

		return undefined;
	}
}
