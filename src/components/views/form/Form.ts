import { Component } from "../../base/Component.ts";
import { ensureElement } from "../../../utils/utils.ts";

interface IForm<T> {
  errors: { [key in keyof T]?: string };
  buttonDisabled: boolean;
}

export class Form<T extends object> extends Component<IForm<T> & T> {
  protected errorElement: HTMLElement;
  protected buttonForm: HTMLButtonElement;

  constructor(container: HTMLElement) {
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
  }

  set errors(value: { [key in keyof T]: string }) {
    this.errorElement.textContent = Object.values(value).join(", ");
  }

  set buttonDisabled(value: boolean) {
    this.buttonForm.disabled = !value;
  }
}
