import { AbstractParser } from "./AbstractParser";
import { WeeklyMenu } from "./WeeklyMenu";

import * as winston from "winston";

export class Location {
	protected logger = new winston.Logger({
		level: process.env.LOG_LEVEL || "info",
		transports: [
			new winston.transports.Console({
				label: "AbstractParser"
			})
		]
	});

	private nameAt: string = undefined;
	private url: string = undefined;
	private parser: AbstractParser;
	private weeklyMenu: WeeklyMenu = new WeeklyMenu();

	public constructor(nameAt: string, url: string, parser: AbstractParser) {
		this.setNameAt(nameAt);
		this.setUrl(url);
		this.setParser(parser);
	}

	public getNameAt(): string {
		return this.nameAt;
	}

	public setNameAt(nameAt: string): void {
		this.nameAt = nameAt;
	}

	public getUrl(): string {
		return this.url;
	}

	public setUrl(url: string): void {
		this.url = url;
	}

	public getParser(): AbstractParser {
		return this.parser;
	}

	public setParser(parser: AbstractParser): void {
		this.parser = parser;
	}

	public getWeeklyMenu(): WeeklyMenu {
		return this.weeklyMenu;
	}

	public setWeeklyMenu(weeklyMenu: WeeklyMenu): void {
		this.weeklyMenu = weeklyMenu;
	}

	public loadWeeklyMenu(html?: string): void {
		let parser: AbstractParser = this.getParser();
		if (parser) {
			if (html) {
				parser.setHtml(html)
			}

			this.logger.debug("parsing weekly menu");
			let weeklyMenu: WeeklyMenu = parser.parseWeeklyMenu();
			if (weeklyMenu) {
				this.setWeeklyMenu(weeklyMenu);
			}
			else {
				this.logger.error("error parsing weekly menu");
			}
		}
		else {
			this.logger.error("no parser");
		}
	}
}
