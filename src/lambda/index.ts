import { LocationManager } from "./LocationManager";
import { Location } from "./Location";

import { ParserAlteRaffinerie } from "./ParserAlteRaffinerie";
import { ParserCrowns } from "./ParserCrowns";
import { ParserNachtkantine } from "./ParserNachtkantine";

let locationManager = new LocationManager();

locationManager.multiPut(
	["Alte Raffinerie", "Storchenburg"],
	new Location("in der Alten Raffinerie",
		"http://www.alte-raffinerie.de/index.php/Essen.html",
		new ParserAlteRaffinerie()));

locationManager.put(
	"Crowns",
	new Location("im Crowns",
		"http://www.crownsrestaurant.de/wochenkarte/",
		new ParserCrowns())
);

locationManager.put(
	"Nachtkantine",
	new Location("in der Nachtkantine",
		"http://www.nachtkantine.de/mittagskarte/",
		new ParserNachtkantine())
);
