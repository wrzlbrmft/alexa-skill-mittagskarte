import { AbstractParser } from "./AbstractParser";
import { Weekday, weekdays } from "./Weekday";
import { MenuDay } from "./MenuDay";
import { Menu } from "./Menu";

import * as cheerio from "cheerio";

export class ParserAlteRaffinerie extends AbstractParser {
	public constructor() {
		super();
	}

	public parseMenuDay(weekday: Weekday): MenuDay {
		let menuDay: MenuDay = new MenuDay();
		let $ = cheerio.load(this.getHtml());

		let isWeekday: boolean = false;
		$("strong,p").each((index, element) => {
			if ("strong" == element.name.toLowerCase()) {
				isWeekday = ($(element).text().toLowerCase() == weekdays.get(weekday).toLowerCase());
			}
			if (isWeekday) {
				if ("p" == element.name.toLowerCase()) {
					let name = $(element).text()
						.replace(/(\r?\n|\r)/g, " ")	// remove unnecessary newlines
						.trim()							// could have started/ended with newline
						.split("\t")[0]					// menu names and prices are split by one or more tabs
						.replace(/&/g, "und")			// use "und" instead of ampersands
						.replace(/ – /g, "-")			// remove typographic dashes
						.replace(/\s+/g, " ");			// deduplicate whitespace

					if ("" == name) {
						isWeekday = false;
					}
					else {
						menuDay.add(new Menu(name));
					}
				}
			}
		});

		return menuDay;
	}
}
