import { IFormActions, TPayment } from "../../../types";
import { ensureAllElements, ensureElement } from "../../../utils/utils";
import { Form } from "./Form";

export interface IFormOrder {
  payment: "card" | "cash" | null;
  address: string;
}

export class FormOrder extends Form<IFormOrder> {
  protected paymentButtons: HTMLButtonElement[];
  protected addressInput: HTMLInputElement;

  constructor(container: HTMLElement, actions?: IFormActions) {
    super(container, actions);

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
        if (actions?.paymentButtonClick) {
          actions.paymentButtonClick(button.name as TPayment);
        }
      });
    });

    this.addressInput.addEventListener("input", () => {
      if (actions?.addressInputChange) {
        actions.addressInputChange(this.addressInput.value);
      }
    });
  }

  set payment(value: "card" | "cash" | null) {
    this.paymentButtons.forEach((button) => {
      button.classList.toggle("button_alt-active", button.name === value);
    });
  }

  set address(value: string) {
    this.addressInput.value = value;
  }
}
