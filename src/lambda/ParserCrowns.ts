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
		let startDate: string = "YYYY-MM-DD";
		let $ = cheerio.load(this.getHtml());

		$("#main-content p").each((index, element) => {
			let text: string =	$(element).text().replace(/(\r?\n|\r)/g, " "); // remove newlines
			let textString = S(text).trim(); // trim

			if (0 == textString.s.toLowerCase().indexOf("in der woche von ")) {
				let startDateString = textString.between("oche von ", " –")
					.replaceAll("2016", "2017"); // fix wrong year
				let startDateMoment = moment(startDateString.trim().s, "DD.MM.YYYY", "de");

				startDate = startDateMoment.format("YYYY-MM-DD");
			}
		});

		return startDate;
	}

	public parseDay(weekday: Weekday): Array<Menu> {
		let day: Array<Menu> = [];
		let $ = cheerio.load(this.getHtml());

		let isWeekday: boolean = false;
		$("#main-content p,#main-content h3").each((index, element) => {
			let text: string =	$(element).text().replace(/(\r?\n|\r)/g, " "); // remove newlines
			let textString = S(text).trim(); // trim

			if ("p" == element.name.toLowerCase()) {
				if (isWeekday) {
					if (-1 == textString.s.toLowerCase().indexOf("oder")) {
						let menuNameString = textString
							.decodeHTMLEntities()	// decode HTML entities
							.replaceAll("“", "\"")	// use regular quotes instead of typographic quotes
							.replaceAll("”", "\"")	// use regular quotes instead of typographic quotes
							.chompLeft("1.")		// remove "1." at the beginning
							.chompLeft("2.")		// remove "2." at the beginning
							.trimLeft()				// trim at the beginning
							.collapseWhitespace();	// collapse whitespace

						if (!menuNameString.isEmpty()) {
							day.push(new Menu(menuNameString.s));
						}
					}
				}
			}

			if ("h3" == element.name.toLowerCase()) {
				isWeekday = (textString.s.toLowerCase() == weekdays.get(weekday).toLowerCase());
			}
		});

		return day;
	}
}
