import { AbstractParser } from "./AbstractParser";
import { MenuWeek } from "./MenuWeek";
import { Weekday } from "./Weekday";
import { MenuDay } from "./MenuDay";

export class Location {
	private nameAt: string;
	private url: string;
	private parser: AbstractParser;
	private menuWeek: MenuWeek = new MenuWeek();

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

	public getMenuWeek(): MenuWeek {
		return this.menuWeek;
	}

	public setMenuWeek(menuWeek: MenuWeek): void {
		this.menuWeek = menuWeek;
	}

	public loadMenuWeek(): void {
		this.setMenuWeek(this.getParser().parseMenuWeek());
	}

	public getMenuDay(weekday: Weekday): MenuDay {
		return this.getMenuWeek().get(weekday);
	}
}
