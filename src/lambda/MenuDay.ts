import { Dish } from "./Dish";

export class MenuDay {
	private dishes: Array<Dish> = [];

	public constructor(...dishes: Array<Dish>) {
		if (dishes && dishes.length) {
			this.setDishes(dishes);
		}
	}

	public getDishes(): Array<Dish> {
		return this.dishes;
	}

	public setDishes(dishes: Array<Dish>): void {
		this.dishes = dishes;
	}

	public addDish(dish: Dish): void {
		this.getDishes().push(dish);
	}
}
