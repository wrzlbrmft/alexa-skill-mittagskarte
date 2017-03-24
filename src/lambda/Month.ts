import { NumberMap } from "./NumberMap";

export enum Month {
	January = 1,
	February,
	March,
	April,
	May,
	June,
	July,
	August,
	September,
	October,
	November,
	December
}

export const months: NumberMap<string> = new NumberMap<string>();
months.put(Month.January, "Januar");
months.put(Month.February, "Februar");
months.put(Month.March, "März");
months.put(Month.April, "April");
months.put(Month.May, "Mai");
months.put(Month.June, "Juni");
months.put(Month.July, "Juli");
months.put(Month.August, "August");
months.put(Month.September, "September");
months.put(Month.October, "Oktober");
months.put(Month.November, "November");
months.put(Month.December, "Dezember");
