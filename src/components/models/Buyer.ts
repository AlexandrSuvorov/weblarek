import type { IBuyer, IBuyerErrors } from "../../types";
import { IEvents, EventPresenter } from "../base/Events";

const emptyData = {
  payment: null,
  address: "",
  phone: "",
  email: "",
};

export class Buyer {
  private buyer: IBuyer | null = null;

  constructor(protected events: IEvents) {}

  get buyerItem(): IBuyer | null {
    return this.buyer;
  }

  set buyerItem(Buyer: Partial<IBuyer>) {
    if (!this.buyer) {
      this.buyer = {
        payment: null,
        email: "",
        phone: "",
        address: "",
      };
    }
    Object.assign(this.buyer, Buyer);
    this.events.emit(EventPresenter.buyerChange);
  }

  clearItem(): void {
    this.buyer = { ...emptyData };
    this.events.emit(EventPresenter.buyerClear);
  }

  validateItem(): IBuyerErrors {
    const errors: IBuyerErrors = {};
    if (!this.buyer || this.buyer.address === "") {
      errors.address = "Поле 'Адрес' не может быть пустым";
    }
    if (!this.buyer || this.buyer.phone === "") {
      errors.phone = "Поле 'Телефон' не может быть пустым";
    }
    if (!this.buyer || this.buyer.email === "") {
      errors.email = "Поле 'Эл. почта' не может быть пустым";
    }
    if (!this.buyer || this.buyer.payment === null) {
      errors.payment = "Поле 'Способ оплаты' не может быть пустым";
    }
    return errors;
  }
}
