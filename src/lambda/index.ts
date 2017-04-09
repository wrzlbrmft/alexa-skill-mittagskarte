import { MultiStringMap } from "./MultiStringMap";
import { Location } from "./Location";
import { ParserExample } from "./ParserExample";
import { ParserAlteRaffinerie } from "./ParserAlteRaffinerie";
import { ParserAlterWirt } from "./ParserAlterWirt";
import { ParserCrowns } from "./ParserCrowns";
import { ParserNachtkantine } from "./ParserNachtkantine";
import { WeeklyMenu } from "./WeeklyMenu";
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

logger.info("BEGIN: lambda function");

let locations: MultiStringMap<Location> = new MultiStringMap<Location>();

locations.put("beispiel",
	new Location("zum Beispiel",
		null,
		new ParserExample()));

locations.multiPut(["alte raffinerie", "alten raffinerie", "storchenburg"],
	new Location("in der Alten Raffinerie",
		"http://www.alte-raffinerie.de/index.php/Essen.html",
		new ParserAlteRaffinerie()));

locations.multiPut(["alter wirt", "alten wirt", "alter wirt in hohenbrunn", "alten wirt in hohenbrunn"],
	new Location("beim Alten Wirt in Hohenbrunn",
		"http://www.alterwirt-hohenbrunn.com/speisen-a-getraenke/-wochenkarte.html",
		new ParserAlterWirt()));

locations.put("crowns",
	new Location("im Crowns",
		"http://www.crownsrestaurant.de/wochenkarte/",
		new ParserCrowns()));

locations.multiPut(["nachtkantine", "nacht kantine"],
	new Location("in der Nachtkantine",
		"http://www.nachtkantine.de/mittagskarte/",
		new ParserNachtkantine()));

let handlers = {
	"MenusOnDateAtLocation": function() {
		logger.info("intent handler: MenusOnDateAtLocation");

		let speechOutput: string = "Leider kein Gewinn.";

		try {
			let dateSlot = this.event.request.intent.slots.Date;
			let locationSlot = this.event.request.intent.slots.Location;
			logger.info("slots: date='%s', location='%s'", dateSlot.value, locationSlot.value);

			let location: Location = locations.get(locationSlot.value.toLowerCase());
			if (location) {
				logger.debug("location found");

				logger.debug("sending http request (url='%s')", location.getUrl());
				request(location.getUrl(), (error, response, body) => {
					logger.debug("request error='%s'", error);
					// logger.silly("request response=%j", response);
					logger.silly("request body='%s'", body);

					logger.debug("loading weekly menu");
					location.loadWeeklyMenu(body);

					logger.debug("getting weekly menu");
					let weeklyMenu: WeeklyMenu = location.getWeeklyMenu();
					if (weeklyMenu) {

						// TODO: check if weekly menu is up-to-date

						logger.debug("getting day");
						let day: Array<Menu> = weeklyMenu.getDays().get(dateSlot.value);
						if (day) {
							if (day.length) {
								logger.debug("%d menu(s) on day", day.length);



								// >>>>>>>>> SPEECH OUTPUT >>>>>>>>>

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
										speechOutput += ` als Menü ${i + 1} <break time='50ms' />${day[i].getName()}`;
										switch (day.length - i) {
											case 1:
												// no more menu
												speechOutput += ".";
												break;

											case 2:
												// just one more menu
												speechOutput += "<break time='50ms' /> und";
												break;

											default:
												// more than one more menu
												speechOutput += "<break time='50ms' />,";
												break;
										}
									}
								}

								speechOutput += " Guten Appetit!";

								// <<<<<<<<< SPEECH OUTPUT <<<<<<<<<



								logger.info("speechOutput='%s'", speechOutput);
								this.emit(":tell", speechOutput);

								this.context.succeed();
							}
							else {
								logger.warn("no menu(s) on day");
								speechOutput = `Leider kann ich
									an dem Tag auf der Wochenkarte ${location.getNameAt()} nichts finden.`;
								this.emit(":tell", speechOutput);

								this.context.succeed();
							}
						}
						else {
							logger.error("error getting day");
							speechOutput = `Leider kann ich
								an dem Tag auf der Wochenkarte ${location.getNameAt()} nichts finden.`;
							this.emit(":tell", speechOutput);

							this.context.succeed();
						}
					}
					else {
						logger.error("error getting weekly menu");
						speechOutput = "Leider ist beim Verarbeiten der Wochenkarte ein Fehler aufgetreten.";
						this.emit(":tell", speechOutput);

						this.context.succeed();
					}
				});
			}
			else {
				logger.error("location not found");

				this.context.fail();
			}
		}
		catch (e) {
			logger.error(e.toString());

			this.context.fail();
		}
	}
};

export function handler(event, context, callback) {
	logger.info("intent handler");

	// http://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-context.html#nodejs-prog-model-context-properties
	context.callbackWaitsForEmptyEventLoop = false;

	let alexa = Alexa.handler(event, context);
	alexa.registerHandlers(handlers);
	alexa.execute();
}

logger.info("END: lambda function");



/* testing *
let location: Location = locations.get("beispiel");
request(location.getUrl(), (error, response, body) => {
	location.loadWeeklyMenu(body);

	location.getWeeklyMenu().getDays().forEach((date: string, day: Array<Menu>) => {
		console.log(date + ":");
		day.forEach((menu: Menu) => {
			console.log("    - " + menu.getName());
		});
	});
});
// */
