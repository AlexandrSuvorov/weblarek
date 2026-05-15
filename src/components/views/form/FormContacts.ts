import { ensureElement } from "../../../utils/utils.ts";
import { Form } from "./Form.ts";

export interface IFormContacts {
  email: string;
  phone: string;
}
interface IFormActions {
  emailChange: (email: string) => void;
  phoneChange: (phone: string) => void;
  submitClick: () => void;
}

export class FormContacts extends Form<IFormContacts> {
  protected emailInput: HTMLInputElement;
  protected phoneInput: HTMLInputElement;

  constructor(container: HTMLElement, actions?: IFormActions) {
    super(container);

    this.emailInput = ensureElement<HTMLInputElement>(
      'input[name="email"]',
      this.container,
    );
    this.phoneInput = ensureElement<HTMLInputElement>(
      'input[name="phone"]',
      this.container,
    );

    this.emailInput.addEventListener("input", () => {
      if (actions?.emailChange) {
        actions.emailChange(this.emailInput.value);
      }
    });
    this.phoneInput.addEventListener("input", () => {
      if (actions?.phoneChange) {
        actions.phoneChange(this.phoneInput.value);
      }
    });

    this.buttonForm.addEventListener("click", (event) => {
      event.preventDefault();
      if (actions?.submitClick) {
        actions.submitClick();
      }
    });
  }

  set email(value: string) {
    this.emailInput.value = value;
  }

  set phone(value: string) {
    this.phoneInput.value = value;
  }
}
