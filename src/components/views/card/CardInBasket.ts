import { ensureElement } from "../../../utils/utils.ts";
import { Card } from "./Card.ts";
import type { IProduct } from "../../../types/index.ts";

interface ICard extends Partial<IProduct> {
  index: number;
}

interface ICatalogActions {
  deleteButtonElement?: () => void;
}

export class CardInBasket extends Card<ICard> {
  protected indexElement: HTMLElement;
  protected deleteButton: HTMLButtonElement;

  constructor(container: HTMLElement, actions?: ICatalogActions) {
    super(container);

    this.indexElement = ensureElement<HTMLElement>('.basket__item-index', this.container);
    this.deleteButton = ensureElement<HTMLButtonElement>('.card__button', this.container);

    if (actions?.deleteButtonElement) {
      this.deleteButton.addEventListener("click", actions.deleteButtonElement);
    }
  };

  set index(value: number) {
    this.indexElement.textContent = String(value);
  };
}