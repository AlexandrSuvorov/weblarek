import { Component } from "../base/Component";
import { ensureElement } from "../../utils/utils";
import { IEvents, EventPresenter } from "../base/Events";

interface IModalElement {
  content: HTMLElement;
}

export class ModalView extends Component<IModalElement> {
  protected closeButton: HTMLButtonElement;
  protected modalElement: HTMLDivElement;

  constructor(
    container: HTMLElement,
    protected events: IEvents,
  ) {
    super(container);

    this.modalElement = ensureElement<HTMLDivElement>(
      ".modal__content",
      this.container,
    );
    this.closeButton = ensureElement<HTMLButtonElement>(
      ".modal__close",
      this.container,
    );

    this.closeButton.addEventListener("click", () => {
      this.events.emit(EventPresenter.closeModal);
    });

    this.container.addEventListener("click", (event) => {
      if (event.target === this.container) {
        this.events.emit(EventPresenter.closeModal);
      }
    });
  }

  set content(content: HTMLElement) {
    this.modalElement.replaceChildren(content);
  }

  open(): void {
    this.container.classList.add("modal_active");
  }

  close(): void {
    this.container.classList.remove("modal_active");
  }
}
