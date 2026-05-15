import { Component } from '../base/Component.ts';
import { ensureElement } from '../../utils/utils.ts';
import { IEvents } from '../base/Events.ts';

interface IModalElement {
    element: HTMLElement;
}

export class ModalView extends Component<IModalElement> {
    protected closeButton: HTMLButtonElement;
    protected modalElement: HTMLDivElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);

        this.modalElement = ensureElement<HTMLDivElement>('.modal__content', this.container);
        this.closeButton = ensureElement<HTMLButtonElement>('.modal__close', this.container);

        this.closeButton.addEventListener('click', () => {
            this.events.emit('modal:close');
        })
        this.container.addEventListener('click', (event) => {
            if (event.target === this.container) {
                this.events.emit('modal:close');
            }
        });
    };

    set content(value: HTMLElement) {
        this.modalElement.replaceChildren(value);
    }

    open(): void {
        this.container.classList.add('modal_active');
    };

    close(): void {
        this.container.classList.remove('modal_active');
    };
}