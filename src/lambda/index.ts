import { MultiStringMap } from "./MultiStringMap";
import { Location } from "./Location";
import { ParserExample } from "./ParserExample";
import { ParserAlteRaffinerie } from "./ParserAlteRaffinerie";
import { ParserCrowns } from "./ParserCrowns";
import { ParserNachtkantine } from "./ParserNachtkantine";
import { Weekday } from "./Weekday";
import { Menu } from "./Menu";

import * as request from "request";

let locations: MultiStringMap<Location> = new MultiStringMap<Location>();

locations.put("Beispiel",
	new Location("zum Beispiel",
		null,
		new ParserExample()));

locations.multiPut(["Alte Raffinerie", "Storchenburg"],
	new Location("in der Alten Raffinerie",
		"http://www.alte-raffinerie.de/index.php/Essen.html",
		new ParserAlteRaffinerie()));

locations.put("Crowns",
	new Location("im Crowns",
		"http://www.crownsrestaurant.de/wochenkarte/",
		new ParserCrowns()));

locations.put("Nachtkantine",
	new Location("in der Nachtkantine",
		"http://www.nachtkantine.de/mittagskarte/",
		new ParserNachtkantine()));

// let location: Location = locations.get("Beispiel");
let location: Location = locations.get("Alte Raffinerie");
request(location.getUrl(), (error, response, body) => {
	location.getParser().setHtml(body);
	location.loadWeeklyMenu();

	location.getWeeklyMenu().getDailyMenus().get(Weekday.Wednesday).forEach((menu: Menu) => {
		console.log(menu.getName());
	});
});
