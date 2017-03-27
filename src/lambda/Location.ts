import { AbstractParser } from "./AbstractParser";
import { WeeklyMenu } from "./WeeklyMenu";

export class Location {
	private nameAt: string;
	private url: string;
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

	public loadWeeklyMenu(): void {
		this.setWeeklyMenu(this.getParser().parseWeeklyMenu());
	}
}
