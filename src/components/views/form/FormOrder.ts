import { TPayment } from "../../../types/index.ts";
import { ensureAllElements, ensureElement } from "../../../utils/utils.ts";
import { Form } from "./Form.ts";

export interface IFormOrder {
  payment: "cash" | "card" | null;
  address: string;
}

interface IFormOrderActions {
  paymentClick: (payment: TPayment) => void;
  addressChange: (address: string) => void;
  submitClick: () => void;
}

export class FormOrder extends Form<IFormOrder> {
  protected paymentButtons: HTMLButtonElement[];
  protected addressInput: HTMLInputElement;

  constructor(container: HTMLElement, actions?: IFormOrderActions) {
    super(container);

    const paymentButtonsContainer = ensureElement<HTMLDivElement>(
      ".order__buttons",
      this.container,
    );
    this.paymentButtons = ensureAllElements<HTMLButtonElement>(
      ".button",
      paymentButtonsContainer,
    );
    this.addressInput = ensureElement<HTMLInputElement>(
      'input[name="address"]',
      this.container,
    );

    this.paymentButtons.forEach((button) => {
      button.addEventListener("click", () => {
        if (actions?.paymentClick) {
          actions.paymentClick(button.name as TPayment);
        }
      });
    });

    this.addressInput.addEventListener("input", () => {
      if (actions?.addressChange) {
        actions.addressChange(this.addressInput.value);
      }
    });

    this.buttonForm.addEventListener("click", (event) => {
      event.preventDefault();
      if (actions?.submitClick) {
        actions.submitClick();
      }
    });
  }

  set payment(value: "card" | "cash" | "") {
    this.paymentButtons.forEach((button) => {
      button.classList.toggle("button_alt-active", button.name === value);
    });
  }

  set address(value: string) {
    this.addressInput.value = value;
  }
}
