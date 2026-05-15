import { ensureElement } from "../../../utils/utils.ts";
import { Card } from "./Card.ts";
import { categoryMap, CDN_URL } from "../../../utils/constants.ts";
import type { IProduct } from "../../../types/index.ts";

type TCardPreview = Pick<IProduct, 'image' | 'category' | 'description'> & {
	buttonText: string,
	isDisabled: boolean
}

interface ICatalogActions {
	onPurchaseClick?: () => void;
}

type categoryKey = keyof typeof categoryMap;

export class CardPreview extends Card<TCardPreview> {
	protected imageElement: HTMLImageElement;
	protected categoryElement: HTMLElement;
	protected descriptionElement: HTMLElement;
	protected buttonElement: HTMLButtonElement;

	constructor(container: HTMLElement, actions?: ICatalogActions) {
		super(container);

		this.imageElement = ensureElement<HTMLImageElement>('.card__image', this.container);
		this.categoryElement = ensureElement<HTMLElement>('.card__category', this.container);
		this.descriptionElement = ensureElement<HTMLElement>('.card__text', this.container);
		this.buttonElement = ensureElement<HTMLButtonElement>('.card__button', this.container);

		if (actions?.onPurchaseClick) {
			this.buttonElement.addEventListener("click", actions.onPurchaseClick);
		}
	}

	set image(value: string) {
		this.setImage(this.imageElement, CDN_URL + value, this.title);
	}

	set category(value: string) {
		this.categoryElement.textContent = String(value);

		for (const key in categoryMap) {
			this.categoryElement.classList.toggle(
				categoryMap[key as categoryKey],
				key === value
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