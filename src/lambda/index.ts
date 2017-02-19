import { Location } from "./Location";
import { LocationManager } from "./LocationManager";
import { ParserExample } from "./ParserExample";
import { ParserAlteRaffinerie } from "./ParserAlteRaffinerie";
import { ParserCrowns } from "./ParserCrowns";
import { ParserNachtkantine } from "./ParserNachtkantine";

let locationManager: LocationManager = new LocationManager();

locationManager.put(
	"Beispiel",
	new Location("zum Beispiel",
		null,
		new ParserExample()));

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
