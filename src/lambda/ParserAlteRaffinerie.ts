import { AbstractParser } from "./AbstractParser";
import { Weekday, weekdays } from "./Weekday";
import { Menu } from "./Menu";

import * as winston from "winston";
import * as cheerio from "cheerio";
import * as S from "string";
import * as moment from "moment";

export class ParserAlteRaffinerie extends AbstractParser {
    protected logger = winston.createLogger({
        level: process.env.LOG_LEVEL || "info",
        format: winston.format.label({
            label: "ParserAlteRaffinerie"
        }),
        transports: [
            new winston.transports.Console()
        ]
    });

    public constructor(html?: string) {
        super(html);
    }

    public parseStartDate(): string {
        try {
            let startDate: string = undefined;
            let $ = cheerio.load(this.getHtml());

            $("strong").each((index, element) => {
                let text: string = $(element).text().replace(/(\r?\n|\r)/g, " "); // remove newlines
                let textString = S(text).trim(); // trim

                this.logger.silly("found potential start date => '%s'", textString.s);

                if (0 == textString.s.toLowerCase().indexOf("wochenkarte von montag ")) {
                    let startDateString = textString.between("ontag ", " bis");
                    this.logger.debug("found start date string => '%s'", startDateString.s);

                    let format: string = "D. MMMM";
                    this.logger.debug("converting to date (format='%s')", format);
                    try {
                        let startDateMoment = moment(startDateString.trim().s, format, "de");
                        startDate = startDateMoment.format("YYYY-MM-DD");
                        this.logger.debug("date => '%s'", startDate);
                    }
                    catch (e) {
                        this.logger.error("error converting to date (%s)", e.toString());
                    }
                }
            });

            return startDate;
        }
        catch (e) {
            this.logger.error("error parsing start date (%s)", e.toString());
        }

        return undefined;
    }

    public parseDay(weekday: Weekday): Array<Menu> {
        try {
            let day: Array<Menu> = [];
            let $ = cheerio.load(this.getHtml());

            let isWeekday: boolean = false;
            $("p,strong").each((index, element) => {
                let text: string = $(element).text().replace(/(\r?\n|\r)/g, " "); // remove newlines
                let textString = S(text).trim(); // trim

                if (textString.isEmpty()) {
                    if (isWeekday) {
                        this.logger.debug("found end of weekday");
                    }
                    isWeekday = false;
                }

                if ("p" == element.name.toLowerCase()) {
                    if (isWeekday) {
                        let menuNameString = textString
                            .between("", "\t")        // menu names and prices are separated with one or more tabs
                            .replaceAll("&", "und")    // use "und" instead of "&"
                            .replaceAll(" – ", "-") // use "-" instead of typographic hyphens
                            .collapseWhitespace();    // collapse whitespace

                        if (!menuNameString.isEmpty()) {
                            this.logger.debug("found menu => '%s'", menuNameString.s);
                            day.push(new Menu(menuNameString.s));
                        }
                    }
                }

                if ("strong" == element.name.toLowerCase()) {
                    this.logger.silly("found potential weekday => '%s'", textString.s);

                    if (textString.s.toLowerCase() == weekdays.get(weekday).toLowerCase()) {
                        this.logger.debug("found beginning of weekday ('%s')", textString.s);
                        isWeekday = true;
                    }
                    else {
                        if (isWeekday) {
                            this.logger.debug("found end of weekday");
                        }
                        isWeekday = false;
                    }
                }
            });

            return day;
        }
        catch (e) {
            this.logger.error("error parsing day (%s)", e.toString());
        }

        return undefined;
    }
}
