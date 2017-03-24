import { List } from "./List";
import { Menu } from "./Menu";

export class MenuDay extends List<Menu> {
	public constructor(...items: Array<Menu>) {
		super(...items);
	}
}
