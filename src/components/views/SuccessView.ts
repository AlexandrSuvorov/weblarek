import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { ISuccessActions } from "../../types";

interface ISuccessView {
  total: number;
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

    if (actions?.successButtonClickHandler) {
      this.closeButton.addEventListener(
        "click",
        actions.successButtonClickHandler,
      );
    }
  }

  set total(value: number) {
    this.descriptionElement.textContent = `Списано ${value} синапсов`;
  }
}
