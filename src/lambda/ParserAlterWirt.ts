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
		let startDate: string = "YYYY-MM-DD";
		let $ = cheerio.load(this.getHtml());

		$("table.contentpaneopen p").each((index, element) => {
			let text: string = $(element).text().replace(/(\r?\n|\r)/g, " "); // remove newlines
			let textString = S(text).trim(); // trim

			if (0 == textString.s.toLowerCase().indexOf("vom ")) {
				let startDateString = textString.between("vom ", " bis");
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
		$("table.contentpaneopen p,table.contentpaneopen strong").each((index, element) => {
			let text: string = $(element).text().replace(/(\r?\n|\r)/g, " "); // remove newlines
			let textString = S(text).trim(); // trim

			if ("p" == element.name.toLowerCase()) {
				if (isWeekday) {
					if (textString.startsWith("Gericht ") || textString.startsWith("Vegetarisch:"))
					{
						let menuNameString = textString
							.chompLeft("Gericht 1:")	// remove "Gericht 1:" at the beginning
							.chompLeft("Gericht 2:")	// remove "Gericht 2:" at the beginning
							.chompLeft("Vegetarisch:")	// remove "Vegetarisch:" at the beginning
							.trimLeft()
							.collapseWhitespace();	// collapse whitespace

						if (!menuNameString.isEmpty()) {
							day.push(new Menu(menuNameString.s));
						}
					}
				}
			}

			if ("strong" == element.name.toLowerCase()) {
				if (!textString.isEmpty()) {
					isWeekday = (textString.strip("-").trim().s.toLowerCase() == weekdays.get(weekday).toLowerCase());
				}
			}
		});

		return day;
	}
}
