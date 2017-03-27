import { StringMap } from "./StringMap";
import { Menu } from "./Menu";

export class WeeklyMenu {
	private startDate: string = "yyyy-mm-dd";
	private days: StringMap<Array<Menu>> = new StringMap<Array<Menu>>();

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

	public getDays(): StringMap<Array<Menu>> {
		return this.days;
	}

	public setDays(days: StringMap<Array<Menu>>): void {
		this.days = days;
	}
}
