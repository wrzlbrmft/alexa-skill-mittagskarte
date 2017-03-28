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
		let startDate: string = "YYYY-MM-DD";
		let $ = cheerio.load(this.getHtml());

		$("h4").each((index, element) => {
			let text: string = $(element).text().replace(/(\r?\n|\r)/g, " "); // remove newlines
			let textString = S(text).trim(); // trim

			if (0 == textString.s.toLowerCase().indexOf("montag, ")) {
				let startDateString = textString.between("ontag, ");
				let startDateMoment = moment(startDateString.trim().s, "D. MMMM", "de");

				startDate = startDateMoment.format("YYYY-MM-DD");
			}
		});

		return startDate;
	}

	public parseDay(weekday: Weekday): Array<Menu> {
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
						day.push(new Menu(menuNameString.s));
					}
				}
			}

			if ("h4" == element.name.toLowerCase()) {
				isWeekday = (0 == textString.s.toLowerCase().indexOf(weekdays.get(weekday).toLowerCase()));
			}
		});

		return day;
	}
}
