import { Component } from '../base/Component.ts';
import { ensureElement } from '../../utils/utils.ts';
import { IEvents } from "../base/Events.ts";

interface IBasket {
    basket: HTMLElement[];
    total: number;
    buttonDisabled: boolean;
}

export class BasketView extends Component<IBasket> {
    protected basketListElement: HTMLElement;
    protected basketButton: HTMLButtonElement;
    protected totalPriceElement: HTMLElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);

        this.basketListElement = ensureElement<HTMLElement>('.basket__list', this.container);
        this.basketButton = ensureElement<HTMLButtonElement>('.basket__button', this.container);
        this.totalPriceElement = ensureElement<HTMLElement>('.basket__price', this.container);

        this.basketButton.addEventListener('click', () => {
            this.events.emit('basket:order');
        });
    };

    set basket(items: HTMLElement[]) {
        this.basketListElement.replaceChildren(...items);
    };

    set total(value: number) {
        this.totalPriceElement.textContent = `${value} синапсов`;
    };

    set isValid(value: boolean) {
        this.basketButton.disabled = !value;
    };
}