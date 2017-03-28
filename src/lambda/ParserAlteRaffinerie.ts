import { AbstractParser } from "./AbstractParser";
import { Weekday, weekdays } from "./Weekday";
import { Menu } from "./Menu";

import * as winston from "winston";
import * as cheerio from "cheerio";
import * as S from "string";
import * as moment from "moment";

export class ParserAlteRaffinerie extends AbstractParser {
	protected logger = new winston.Logger({
		level: process.env.LOG_LEVEL || "info",
		transports: [
			new winston.transports.Console({
				label: "ParserAlteRaffinerie"
			})
		]
	});

	public constructor(html?: string) {
		super(html);
	}

	public parseStartDate(): string {
		let startDate: string = "YYYY-MM-DD";
		let $ = cheerio.load(this.getHtml());

		$("strong").each((index, element) => {
			let text: string = $(element).text().replace(/(\r?\n|\r)/g, " "); // remove newlines
			let textString = S(text).trim(); // trim

			if (0 == textString.s.toLowerCase().indexOf("wochenkarte von montag ")) {
				let startDateString = textString.between("ontag ", " bis");
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
		$("p,strong").each((index, element) => {
			let text: string = $(element).text().replace(/(\r?\n|\r)/g, " "); // remove newlines
			let textString = S(text).trim(); // trim

			if (textString.isEmpty()) {
				isWeekday = false;
			}

			if ("p" == element.name.toLowerCase()) {
				if (isWeekday) {
					let menuNameString = textString
						.between("", "\t")		// menu names and prices are separated with one or more tabs
						.replaceAll("&", "und")	// use "und" instead of "&"
						.replaceAll(" – ", "-") // use "-" instead of typographic hyphens
						.collapseWhitespace();	// collapse whitespace

					if (!menuNameString.isEmpty()) {
						day.push(new Menu(menuNameString.s));
					}
				}
			}

			if ("strong" == element.name.toLowerCase()) {
				isWeekday = (textString.s.toLowerCase() == weekdays.get(weekday).toLowerCase());
			}
		});

		return day;
	}
}
