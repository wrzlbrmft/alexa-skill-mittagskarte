import { MultiStringMap } from "./MultiStringMap";
import { Location } from "./Location";
import { ParserExample } from "./ParserExample";
import { ParserAlteRaffinerie } from "./ParserAlteRaffinerie";
import { ParserAlterWirt } from "./ParserAlterWirt";
import { ParserCrowns } from "./ParserCrowns";
import { ParserNachtkantine } from "./ParserNachtkantine";
import { Menu } from "./Menu";
import { weekdays } from "./Weekday";

import * as winston from "winston";
import * as Alexa from "alexa-sdk";
import * as request from "request";
import * as moment from "moment";

let logger = new winston.Logger({
	level: process.env.LOG_LEVEL || "info",
	transports: [
		new winston.transports.Console({
			label: "index"
		})
	]
});

let locations: MultiStringMap<Location> = new MultiStringMap<Location>();

locations.put("beispiel",
	new Location("zum Beispiel",
		null,
		new ParserExample()));

locations.multiPut(["alte raffinerie", "storchenburg"],
	new Location("in der Alten Raffinerie",
		"http://www.alte-raffinerie.de/index.php/Essen.html",
		new ParserAlteRaffinerie()));

locations.multiPut(["alter wirt", "alter wirt in hohenbrunn"],
	new Location("beim Alten Wirt in Hohenbrunn",
		"http://www.alterwirt-hohenbrunn.com/speisen-a-getraenke/-wochenkarte.html",
		new ParserAlterWirt()));

locations.put("crowns",
	new Location("im Crowns",
		"http://www.crownsrestaurant.de/wochenkarte/",
		new ParserCrowns()));

locations.put("nachtkantine",
	new Location("in der Nachtkantine",
		"http://www.nachtkantine.de/mittagskarte/",
		new ParserNachtkantine()));

let handlers = {
	"MenusOnDateAtLocation": function() {
		let dateSlot = this.event.request.intent.slots.Date;
		let locationSlot = this.event.request.intent.slots.Location;

		logger.info("MenusOnDateAtLocation: date='%s', location='%s'", dateSlot.value, locationSlot.value);

		let speechOutput: string = "";

		let location: Location = locations.get(locationSlot.value.toLowerCase());
		if (location) {
			logger.debug("location found");

			logger.debug("location url='%s'", location.getUrl());
			request(location.getUrl(), (error, response, body) => {
				logger.debug("request error='%s'", error);
				// logger.silly("request response=%j", response);
				logger.silly("request body='%s'", body);

				location.getParser().setHtml(body);
				location.loadWeeklyMenu();

				let day: Array<Menu> = location.getWeeklyMenu().getDays().get(dateSlot.value);
				if (day && day.length) {
					logger.debug("%d menus found", day.length);

					if (moment().isSame(dateSlot.value, "day")) {
						// today
						speechOutput = "Heute";
					}
					else {
						// not today
						speechOutput = `Am ${weekdays.get(moment(dateSlot.value).weekday())}`;
					}

					speechOutput += ` gibt es ${location.getNameAt()}`;

					if (1 == day.length) {
						// just one menu
						speechOutput += ` <break time='50ms' />${day[0].getName()}.`;
					}
					else {
						// more than one menu
						for (let i = 0; i < day.length; i++) {
							speechOutput += ` als Menü ${i + 1} <break time='100ms' />${day[i].getName()}`;

							switch (day.length - i) {
								case 1:
									// no more
									speechOutput += ".";
									break;

								case 2:
									// just one more
									speechOutput += "<break time='50ms' /> und";
									break;

								default:
									// more than one more
									speechOutput += "<break time='50ms' />,";
									break;
							}
						}
					}

					speechOutput += " Guten Appetit!";
				}
				else {
					logger.warn("no menus found");

					speechOutput = "Leider kein Gewinn.";
				}

				logger.debug("speechOutput='%s'", speechOutput);
				this.emit(":tell", speechOutput);

				this.context.succeed();
			});
		}
		else {
			logger.error("location not found");

			this.context.fail();
		}
	}
};

export function handler(event, context, callback) {
	// see http://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-context.html#nodejs-prog-model-context-properties
	context.callbackWaitsForEmptyEventLoop = false;

	let alexa = Alexa.handler(event, context);
	alexa.registerHandlers(handlers);
	alexa.execute();
}

/* testing *
let location: Location = locations.get("alter wirt");
request(location.getUrl(), (error, response, body) => {
	location.getParser().setHtml(body);
	location.loadWeeklyMenu();

	console.log("startDate=" + location.getWeeklyMenu().getStartDate());

	location.getWeeklyMenu().getDays().forEach((date: string, day: Array<Menu>) => {
		console.log(date + ":");
		day.forEach((menu: Menu) => {
			console.log("    - " + menu.getName());
		});
	});
});
// */
