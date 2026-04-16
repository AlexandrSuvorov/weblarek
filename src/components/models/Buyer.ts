import type { IBuyer } from "../../types";

const emptyData: IBuyer = {
  payment: "card",
  address: "",
  phone: "",
  email: "",
};

export class Buyer {
  private buyer: IBuyer = { ...emptyData };

  get buyerItem(): IBuyer {
    return this.buyer;
  }

  set buyerItem(data: Partial<IBuyer>) {
    this.buyer = {
      ...this.buyer,
      ...data,
    };
  }


  clearItem() {
    this.buyer = { ...emptyData };
  }

  validateItem(): Partial<Record<keyof IBuyer, string>> {
    const errors: Partial<Record<keyof IBuyer, string>> = {};
    const { address, phone, email, payment } = this.buyer;

    if (!address.trim()) {
      errors.address = "Адрес обязателен";
    }

    if (!phone.trim()) {
      errors.phone = "Телефон обязателен";
    }

    if (!email.trim()) {
      errors.email = "Email обязателен";
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      errors.email = "Некорректный email";
    }

    if (!payment) {
      errors.payment = "Способ оплаты обязателен";
    }

    return errors;
  }
}
