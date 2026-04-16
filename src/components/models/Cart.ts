import type { IProduct } from "../../types";

export class Cart {
  private items: IProduct[] = [];

  
  get cartItems(): IProduct[] {
    return this.items;
  }

  addItem(item: IProduct) {
    this.items.push(item);
  }

  removeItem(id: string) {
    this.items = this.items.filter((item) => item.id !== id);
  }

  clearCart() {
    this.items = [];
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
