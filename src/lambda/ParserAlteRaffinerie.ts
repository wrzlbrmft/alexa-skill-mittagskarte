import { AbstractParser } from "./AbstractParser";
import { Weekday, weekdays } from "./Weekday";
import { Menu } from "./Menu";

import * as cheerio from "cheerio";
import * as S from "string";
import * as moment from "moment";

export class ParserAlteRaffinerie extends AbstractParser {
	public constructor(html?: string) {
		super(html);
	}

	public parseStartDate(): string {
		let startDate: string = "yyyy-mm-dd";
		let $ = cheerio.load(this.getHtml());

		$("strong").each((index, element) => {
			let text: string = $(element).text()
				.replace(/(\r?\n|\r)/g, " ")	// remove unnecessary newlines
				.trim();						// trim

			if (0 == text.toLowerCase().indexOf("wochenkarte von montag ")) {
				let textString = S(text);
				let startDateString = textString.between("ontag ", " bis");
				let startDateMoment = moment(startDateString.s, "D. MMMM", "de");

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
			let text: string = $(element).text()
				.replace(/(\r?\n|\r)/g, " ")	// remove unnecessary newlines
				.trim();						// trim

			if ("" == text) {
				isWeekday = false;
			}

			if ("p" == element.name.toLowerCase()) {
				if (isWeekday) {
					day.push(new Menu(text
						.split("\t")[0]			// menu names and prices are separated by one or more tabs
						.replace(/&/g, "und")	// use "und" instead of ampersands
						.replace(/ – /g, "-")	// do not use typographic hyphens
						.replace(/\s+/g, " ")	// dedupe whitespace
					));
				}
			}

			if ("strong" == element.name.toLowerCase()) {
				isWeekday = (text.toLowerCase() == weekdays.get(weekday).toLowerCase());
			}
		});

		return day;
	}
}
