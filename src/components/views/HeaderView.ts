import { Component } from "../base/Component";
import { ensureElement } from "../../utils/utils";
import { EventPresenter, IEvents } from "../base/Events";

interface ICounterBasket {
  counter: number;
}

export class HeaderView extends Component<ICounterBasket> {
  protected counterElement: HTMLElement;
  protected basketButton: HTMLButtonElement;

  constructor(
    container: HTMLElement,
    protected events: IEvents,
  ) {
    super(container);

    this.counterElement = ensureElement<HTMLElement>(
      ".header__basket-counter",
      this.container,
    );
    this.basketButton = ensureElement<HTMLButtonElement>(
      ".header__basket",
      this.container,
    );

    this.basketButton.addEventListener("click", () => {
      this.events.emit(EventPresenter.basketOpen);
    });
  }

  set counter(value: number) {
    this.counterElement.textContent = String(value);
  }
}
