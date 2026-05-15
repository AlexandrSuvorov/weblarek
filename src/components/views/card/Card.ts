import { ensureElement } from "../../../utils/utils.ts";
import { Component } from "../../base/Component.ts";

export abstract class Card<T> extends Component<T> {
    protected titleElement: HTMLElement;
    protected priceElement: HTMLElement;

    constructor(container: HTMLElement) {
        super(container);

        this.titleElement = ensureElement<HTMLElement>('.card__title', this.container);
        this.priceElement = ensureElement<HTMLElement>('.card__price', this.container);
    }

    set title(value: string) {
        this.titleElement.textContent = value;
    }

    set price(value: number | null) {
        if (value) {
            this.priceElement.textContent = `${value} синапсов`;
        } else {
            this.priceElement.textContent = 'Бесценно';
        }
    }
}