import { ensureElement } from "../../utils/utils.ts";
import { Component } from "../base/Component.ts";

interface ISuccessView {
  total: number;
}

interface ISuccessActions {
  onOrdered?: () => void;
  closeButton: () => void;
}

export class SuccessView extends Component<ISuccessView> {
  protected closeButton: HTMLButtonElement;
  protected descriptionElement: HTMLElement;

  constructor(container: HTMLElement, actions?: ISuccessActions) {
    super(container);

    this.descriptionElement = ensureElement<HTMLElement>(
      ".order-success__description",
      this.container,
    );

    this.closeButton = ensureElement<HTMLButtonElement>(
      ".order-success__close",
      this.container,
    );

    this.closeButton.addEventListener("click", (event) => {
      event.preventDefault();

      if (actions?.closeButton) {
        actions.closeButton();
      }
    });
  }

  set total(value: number) {
    this.descriptionElement.textContent = `Списано ${value} синапсов`;
  }
}
