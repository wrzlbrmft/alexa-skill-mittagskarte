import { StringMap } from "./StringMap";
import { Menu } from "./Menu";

export class WeeklyMenu {
	private startDate: string;
	private dailyMenus: StringMap<Array<Menu>> = new StringMap<Array<Menu>>();

	public constructor(startDate?: string) {
		if (startDate) {
			this.setStartDate(startDate);
		}
	}

	public getStartDate(): string {
		return this.startDate;
	}

	public setStartDate(startDate: string): void {
		this.startDate = startDate;
	}

	public getDailyMenus(): StringMap<Array<Menu>> {
		return this.dailyMenus;
	}

	public setDailyMenus(dailyMenus: StringMap<Array<Menu>>): void {
		this.dailyMenus = dailyMenus;
	}
}
