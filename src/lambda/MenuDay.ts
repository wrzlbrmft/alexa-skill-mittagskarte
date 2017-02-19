import { Dish } from "./Dish";

export class MenuDay {
	private dishes: Array<Dish>;

	public constructor() {}

	public getDishes(): Array<Dish> {
		return this.dishes;
	}

	public setDishes(dishes: Array<Dish>): void {
		this.dishes = dishes;
	}

	public addDish(dish: Dish): void {
		this.getDishes().concat(dish);
	}
}
