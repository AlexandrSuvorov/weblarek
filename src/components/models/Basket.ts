import type { IProduct } from "../../types";
import { IEvents } from "../base/Events";

export class Basket {
  private items: IProduct[] = [];
  constructor(protected events: IEvents) {}

  get basketItems(): IProduct[] {
    return this.items;
  }

  addItem(item: IProduct) {
    this.items.push(item);
    this.events.emit("basket:change");
  }

  removeItem(id: string) {
    this.items = this.items.filter((item) => item.id !== id);
    this.events.emit("basket:change");
  }

  clearBasket() {
    this.items = [];
    this.events.emit("basket:change");
  }

  get getTotalPrice(): number {
    return this.items.reduce((total, item) => total + (item.price ?? 0), 0);
  }

  get getItemsCount(): number {
    return this.items.length;
  }

  hasItem(id: string): boolean {
    return this.items.some((item) => item.id === id);
  }
}
