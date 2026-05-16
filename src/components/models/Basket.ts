import type { IProduct } from "../../types";
import { IEvents, EventPresenter } from "../base/Events";

export class Basket {
  private items: IProduct[] = [];
  constructor(protected events: IEvents) {}

  get basketItems(): IProduct[] {
    return this.items;
  }

  addItem(item: IProduct) {
    this.items.push(item);
    this.events.emit(EventPresenter.basketChange);
  }

  removeItem(id: string) {
    this.items = this.items.filter((item) => item.id !== id);
    this.events.emit(EventPresenter.basketChange);
  }

  clearBasket(): void {
    this.items = [];
    this.events.emit(EventPresenter.basketChange);
  }

  get getTotalPrice(): number {
    return this.items.reduce((acc, item: IProduct) => {
      if (item.price !== null) {
        return acc + item.price;
      }
      return acc;
    }, 0);
  }

  get getItemsCount(): number {
    return this.items.length;
  }

  hasItem(id: string): boolean {
    return this.items.some((item) => item.id === id);
  }
}
