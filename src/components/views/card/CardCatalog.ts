import { ensureElement } from "../../../utils/utils";
import { IProduct } from "../../../types";
import { Card } from "./Card";
import { categoryMap, CDN_URL } from "../../../utils/constants";

type TCardCatalog = Pick<
  IProduct,
  "id" | "title" | "image" | "category"
>;

type categoryKey = keyof typeof categoryMap;

interface ICatalogActions {
  showCard?: () => void;
}

export class CardCatalog extends Card<TCardCatalog> {
  protected categoryElement: HTMLElement;
  protected imageElement: HTMLImageElement;

  constructor(container: HTMLElement, actions?: ICatalogActions) {
    super(container);
    this.categoryElement = ensureElement<HTMLElement>(
      ".card__category",
      this.container,
    );
    this.imageElement = ensureElement<HTMLImageElement>(
      ".card__image",
      this.container,
    );
    if (actions?.showCard) {
      this.container.addEventListener("click", actions.showCard);
    }
  }

  set category(value: string) {
    this.categoryElement.textContent = value;

    for (const key in categoryMap) {
      this.categoryElement.classList.toggle(
        categoryMap[key as categoryKey],
        key === value,
      );
    }
  }

  set image(value: string) {
    this.setImage(this.imageElement, CDN_URL + value, this.title);
  }
}
