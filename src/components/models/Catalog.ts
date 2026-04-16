import type { IProduct } from "../../types";

export class Catalog {
  private items: IProduct[] = [];
  private selectedItem: IProduct | null;

  constructor() {
    this.items = [];
    this.selectedItem = null;
  }

  get catalogItems(): IProduct[] {
    return this.items;
  }

  set catalogItems(items: IProduct[]) {
    this.items = items;
  }

  get selectedProduct(): IProduct | null {
    const foundItem = this.selectedItem;
    if (foundItem !== null) {
      return foundItem;
    } else {
      return null;
    }
  }

  set selectedProduct(item: IProduct) {
    this.selectedItem = item;
  }

  getSelectedItem(id: string): IProduct | null {
    const product = this.items.find((item) => item.id === id);
    return product ?? null;
  }
}
