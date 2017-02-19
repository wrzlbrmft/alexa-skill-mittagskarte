import { Location } from "./Location";
import { MultiStringMap } from "./MultiStringMap";

export class LocationManager extends MultiStringMap<Location> {
	public constructor() {
		super();
	}
}
