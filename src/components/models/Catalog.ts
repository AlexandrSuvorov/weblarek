import type { IProduct } from "../../types";
import { IEvents, EventPresenter } from "../base/Events";

export class Catalog {
  private items: IProduct[] = [];
  private selectedItem: IProduct | null = null;

  constructor(protected events: IEvents) {}

  get catalogItems(): IProduct[] {
    return this.items;
  }

  set catalogItems(products: IProduct[]) {
    this.items = products;
    this.events.emit(EventPresenter.catalogAllItems);
  }

  get selectedProductItem(): IProduct | null {
    return this.selectedItem;
  }

  set selectedProductItem(id: string) {
    const product = this.getSelectedItem(id);
    this.selectedItem = product ?? null;
    this.events.emit(EventPresenter.catalogSelectedItem);
  }

  getSelectedItem(id: string): IProduct | undefined {
    return this.items.find((item) => item.id === id);
  }
}
