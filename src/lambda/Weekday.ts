import { NumberMap } from "./NumberMap";

export enum Weekday {
	Sunday = 0,
	Monday,
	Tuesday,
	Wednesday,
	Thursday,
	Friday,
	Saturday
}

export const weekdays: NumberMap<string> = new NumberMap<string>();
weekdays.put(Weekday.Sunday, "Sonntag");
weekdays.put(Weekday.Monday, "Montag");
weekdays.put(Weekday.Tuesday, "Dienstag");
weekdays.put(Weekday.Wednesday, "Mittwoch");
weekdays.put(Weekday.Thursday, "Donnerstag");
weekdays.put(Weekday.Friday, "Freitag");
weekdays.put(Weekday.Saturday, "Samstag");
