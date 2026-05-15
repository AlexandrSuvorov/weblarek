import type { IProduct } from "../../types";
import { IEvents } from "../base/Events";

export class Catalog {
  private items: IProduct[] = [];
  private selectedItem: IProduct | null = null;

  constructor(protected events: IEvents) {}

  get catalogItems(): IProduct[] {
    return this.items;
  }

  set catalogItems(items: IProduct[]) {
    this.items = items;
    this.events.emit(`catalog:changed`);
  }

  get selectedProduct(): IProduct | null {
    return this.selectedItem;
  }

  set selectedProduct(item: string) {
    const product = this.getSelectedItem(item);
    this.selectedItem = product ?? null;
    this.events.emit('card:select');
  }

  getSelectedItem(id: string): IProduct | null {
    const product = this.items.find((item) => item.id === id);
    return product ?? null;
  }
}
