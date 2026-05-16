import { Component } from "../../base/Component";
import { ensureElement } from "../../../utils/utils";
import { IFormActions } from "../../../types";

interface IForm<T> {
  errors: { [key in keyof T]?: string };
  isValid: boolean;
}

export class Form<T extends object> extends Component<IForm<T> & T> {
  protected errorElement: HTMLElement;
  protected buttonForm: HTMLButtonElement;

  constructor(container: HTMLElement, actions?: IFormActions) {
    super(container);

    const actionsModal = ensureElement<HTMLDivElement>(
      ".modal__actions",
      this.container,
    );
    this.errorElement = ensureElement<HTMLElement>(
      ".form__errors",
      actionsModal,
    );
    this.buttonForm = ensureElement<HTMLButtonElement>("button", actionsModal);
    this.buttonForm.addEventListener("click", (event) => {
      event.preventDefault();
      if (actions?.submitButtonClick) {
        actions.submitButtonClick();
      }
    });
  }

  set errors(value: { [key in keyof T]: string }) {
    this.errorElement.textContent = Object.values(value).join(", ");
  }

  set isValid(value: boolean) {
    this.buttonForm.disabled = !value;
  }
}
