import { ensureElement } from "../../../utils/utils";
import { IProduct } from "../../../types";
import { Card } from "./Card";
import { categoryMap, CDN_URL } from "../../../utils/constants";
import { ICardActions } from "../../../types";

export type TCardCatalog = Pick<
  IProduct,
  "id" | "title" | "image" | "category"
>;

type CategoryKey = keyof typeof categoryMap;

export class CardCatalog extends Card<TCardCatalog> {
  protected categoryElement: HTMLElement;
  protected imageElement: HTMLImageElement;

  constructor(container: HTMLElement, actions?: ICardActions) {
    super(container);

    this.imageElement = ensureElement<HTMLImageElement>(
      ".card__image",
      this.container,
    );
    this.categoryElement = ensureElement<HTMLElement>(
      ".card__category",
      this.container,
    );

    if (actions?.onClick) {
      this.container.addEventListener("click", actions.onClick);
    }
  }

  set category(value: string) {
    this.categoryElement.textContent = value;
    for (const key in categoryMap) {
      this.categoryElement.classList.toggle(
        categoryMap[key as CategoryKey],
        key === value,
      );
    }
  }

  set image(value: string) {
    this.setImage(this.imageElement, CDN_URL + value, this.title);
  }
}
