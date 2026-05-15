import type { IBuyer } from "../../types";
import { IEvents } from "../base/Events";

const emptyData: IBuyer = {
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
    this.events.emit(`buyer:change`);
  }

  clearItem() {
    this.buyer = { ...emptyData };
    this.events.emit(`buyer:clear`);
  }

  validateItem(): Partial<Record<keyof IBuyer, string>> {
    const errors: Partial<Record<keyof IBuyer, string>> = {};

    if (!this.buyer) {
      errors.payment = "Данные покупателя отсутствуют";
      return errors;
    }

    const { address, phone, email, payment } = this.buyer;

    if (!address?.trim()) {
      errors.address = "Адрес обязателен";
    }

    if (!phone?.trim()) {
      errors.phone = "Телефон обязателен";
    }

    if (!email?.trim()) {
      errors.email = "Email обязателен";
    }

    if (!payment) {
      errors.payment = "Способ оплаты обязателен";
    }

    return errors;
  }
}
