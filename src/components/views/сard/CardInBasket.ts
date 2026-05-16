import { ensureElement } from "../../../utils/utils";
import { Card } from "./Card";
import { ICardActions, IProduct } from "../../../types";

export interface ICard extends Partial<IProduct> {
  index?: number;
}

export class CardInBasket extends Card<ICard> {
  protected indexElement: HTMLElement;
  protected deleteButton: HTMLButtonElement;

  constructor(container: HTMLElement, actions?: ICardActions) {
    super(container);

    this.indexElement = ensureElement<HTMLElement>(
      ".basket__item-index",
      this.container,
    );
    this.deleteButton = ensureElement<HTMLButtonElement>(
      ".card__button",
      this.container,
    );

    if (actions?.removeItemClick) {
      this.deleteButton.addEventListener("click", actions.removeItemClick);
    }
  }

  set index(value: number) {
    this.indexElement.textContent = String(value);
  }
}
