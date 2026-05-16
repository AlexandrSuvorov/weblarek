import { ensureElement } from "../../../utils/utils";
import { Card } from "./Card";
import { categoryMap, CDN_URL } from "../../../utils/constants";
import { ICardActions, IProduct } from "../../../types";

export type TCardPreview = Pick<
  IProduct,
  "image" | "category" | "description"
> & { buttonText: string; isDisabled: boolean };

type CategoryKey = keyof typeof categoryMap;

export class CardPreview extends Card<TCardPreview> {
  protected imageElement: HTMLImageElement;
  protected categoryElement: HTMLElement;
  protected descriptionElement: HTMLElement;
  protected buttonElement: HTMLButtonElement;

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
    this.descriptionElement = ensureElement<HTMLElement>(
      ".card__text",
      this.container,
    );
    this.buttonElement = ensureElement<HTMLButtonElement>(
      ".card__button",
      this.container,
    );

    if (actions?.onPreviewButtonClick) {
      this.buttonElement?.addEventListener(
        "click",
        actions.onPreviewButtonClick,
      );
    }
  }

  set image(image: string) {
    this.setImage(this.imageElement, CDN_URL + image, this.title);
  }

  set category(category: string) {
    this.categoryElement.textContent = String(category);

    for (const key in categoryMap) {
      this.categoryElement.classList.toggle(
        categoryMap[key as CategoryKey],
        key === category,
      );
    }
  }

  set description(value: string) {
    this.descriptionElement.textContent = value;
  }

  set buttonText(value: string) {
    this.buttonElement.textContent = value;
  }

  set isDisabled(value: boolean) {
    this.buttonElement.disabled = value;
  }
}
