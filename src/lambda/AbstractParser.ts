import { MenuWeek } from "./MenuWeek";

export abstract class AbstractParser {
	private html: string;
	private menuWeek: MenuWeek = new MenuWeek();

	public constructor(html?: string) {
		if (html) {
			this.setHtml(html);
		}
	}

	public getHtml(): string {
		return this.html;
	}

	public setHtml(html: string): void {
		this.html = html;
	}

	public getMenuWeek(): MenuWeek {
		return this.menuWeek;
	}

	public setMenuWeek(menuWeek: MenuWeek): void {
		this.menuWeek = menuWeek;
	}

	public abstract parse(): void;
}
