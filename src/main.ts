import "./scss/styles.scss";

import { Basket } from "./components/models/Basket";
import { Buyer } from "./components/models/Buyer";
import { Catalog } from "./components/models/Catalog";

import { CardCatalog } from "./components/views/сard/CardCatalog";
import { CardInBasket } from "./components/views/сard/CardInBasket";
import { CardPreview } from "./components/views/сard/CardPreview";

import {
  FormContacts,
  IFormContacts,
} from "./components/views/form/FormContacts";
import { FormOrder, IFormOrder } from "./components/views/form/FormOrder";

import { BasketView } from "./components/views/BasketView";
import { GalleryView } from "./components/views/GalleryView";
import { HeaderView } from "./components/views/HeaderView";
import { ModalView } from "./components/views/ModalView";
import { SuccessView } from "./components/views/SuccessView";

import { API_URL } from "./utils/constants";
import { Api } from "./components/base/Api";
import { CatalogApi } from "./components/models/CatalogApi";

import { EventEmitter, EventPresenter } from "./components/base/Events";
import { cloneTemplate, ensureElement } from "./utils/utils";

import type { IProduct, TPayment } from "./types";

const events = new EventEmitter();

const baseApi = new Api(API_URL);
const api = new CatalogApi(baseApi);

const basketModel = new Basket(events);
const buyerModel = new Buyer(events);
const catalogModel = new Catalog(events);

const headerElement = ensureElement<HTMLElement>(".header");
const catalogElement = ensureElement<HTMLElement>(".gallery");
const modalElement = ensureElement<HTMLDivElement>("#modal-container");

const cardCatalogTemplate = ensureElement<HTMLTemplateElement>("#card-catalog");
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>("#card-preview");
const cardBasketTemplate = ensureElement<HTMLTemplateElement>("#card-basket");
const basketTemplate = ensureElement<HTMLTemplateElement>("#basket");
const orderFormTemplate = ensureElement<HTMLTemplateElement>("#order");
const contactsFormTemplate = ensureElement<HTMLTemplateElement>("#contacts");
const successTemplate = ensureElement<HTMLTemplateElement>("#success");

const gallery = new GalleryView(catalogElement, events);
const modal = new ModalView(modalElement, events);
const header = new HeaderView(headerElement, events);
const basket = new BasketView(cloneTemplate(basketTemplate), events);

const cardPreview = new CardPreview(cloneTemplate(cardPreviewTemplate), {
  onPreviewButtonClick: () => {
    events.emit(EventPresenter.cardPreviewButton);
  },
});

const formOrder = new FormOrder(cloneTemplate(orderFormTemplate), {
  paymentButtonClick: (payment) => {
    events.emit(EventPresenter.formOrderPayment, { payment });
  },
  addressInputChange: (address) => {
    events.emit(EventPresenter.formOrderAddress, { address });
  },
  submitButtonClick: () => {
    events.emit(EventPresenter.formOrderSubmit);
  },
});

const formContacts = new FormContacts(cloneTemplate(contactsFormTemplate), {
  emailInputChange: (email) => {
    events.emit(EventPresenter.formContactsEmail, { email });
  },
  phoneInputChange: (phone) => {
    events.emit(EventPresenter.formContactsPhone, { phone });
  },
  submitButtonClick: () => {
    events.emit(EventPresenter.formContactsSubmit);
  },
});

const successView = new SuccessView(cloneTemplate(successTemplate), {
  successButtonClickHandler: () => {
    events.emit(EventPresenter.successSubmit);
  },
});

api
  .getCatalogItems()
  .then((data) => {
    catalogModel.catalogItems = data;
  })
  .catch();

events.on(EventPresenter.catalogAllItems, () => {
  const itemCards = catalogModel.catalogItems.map((item) => {
    const onClick = () => {
      events.emit(EventPresenter.cardClick, { product: item });
    };
    const card = new CardCatalog(cloneTemplate(cardCatalogTemplate), {
      onClick,
    });
    return card.render(item);
  });
  gallery.render({
    catalog: itemCards,
  });
});

events.on<{ product: IProduct }>(EventPresenter.cardClick, ({ product }) => {
  catalogModel.selectedProductItem = product.id;
});

function getCardButtonState(product: IProduct, isInBasket: boolean) {
  let buttonText = "Купить";
  let isDisabled = false;

  if (product.price === null) {
    buttonText = "Недоступно";
    isDisabled = true;
  } else if (isInBasket) {
    buttonText = "Удалить из корзины";
  }

  return { buttonText, isDisabled };
}

events.on(EventPresenter.catalogSelectedItem, () => {
  const product = catalogModel.selectedProductItem;
  if (product) {
    const isInBasket = basketModel.hasItem(product.id);
    const { buttonText, isDisabled } = getCardButtonState(product, isInBasket);

    const preview = cardPreview.render({ ...product, buttonText, isDisabled });
    modal.render({ content: preview });
    modal.open();
  }
});

events.on(EventPresenter.cardPreviewButton, () => {
  const product = catalogModel.selectedProductItem;
  if (product) {
    if (basketModel.hasItem(product.id)) {
      basketModel.removeItem(product.id);
    } else {
      basketModel.addItem(product);
    }
    modal.close();
  }
});

events.on(EventPresenter.basketChange, () => {
  header.render({ counter: basketModel.getItemsCount });
  const selectedProduct = catalogModel.selectedProductItem;
  if (selectedProduct) {
    const isInBasket = basketModel.hasItem(selectedProduct.id);
    const { buttonText, isDisabled } = getCardButtonState(
      selectedProduct,
      isInBasket,
    );
    cardPreview.render({ buttonText, isDisabled });
  }

  const cardBasketArray = basketModel.basketItems.map((item, index) => {
    const cardBasket = new CardInBasket(cloneTemplate(cardBasketTemplate), {
      removeItemClick: () => {
        events.emit(EventPresenter.basketRemoveItem, { product: item });
      },
    });
    return cardBasket.render({ ...item, index: index + 1 });
  });

  basket.render({
    basket: cardBasketArray,
    total: basketModel.getTotalPrice,
    isValid: basketModel.getItemsCount > 0,
  });
});

events.on(EventPresenter.basketOpen, () => {
  modal.render({
    content: basket.render({ isValid: basketModel.getItemsCount > 0 }),
  });
  modal.open();
});

events.on<{ product: IProduct }>(
  EventPresenter.basketRemoveItem,
  ({ product }) => {
    basketModel.removeItem(product.id);
    modal.render({ content: basket.render() });
  },
);

events.on(EventPresenter.basketOrder, () => {
  const data = buyerModel.buyerItem;
  const errors = buyerModel.validateItem();

  const orderErrors: Partial<Record<keyof IFormOrder, string>> =
    Object.fromEntries(
      Object.entries(errors).filter((error) => {
        return ["payment", "address"].includes(error[0]);
      }),
    );

  const isValid = Object.keys(orderErrors).length === 0;

  modal.render({
    content: formOrder.render({
      payment: data?.payment ?? null,
      address: data?.address ?? "",
      errors: orderErrors,
      isValid: isValid,
    }),
  });
});

events.on(
  EventPresenter.formOrderPayment,
  ({ payment }: { payment: TPayment }) => {
    buyerModel.buyerItem = { payment };
  },
);

events.on(
  EventPresenter.formOrderAddress,
  ({ address }: { address: string }) => {
    buyerModel.buyerItem = { address };
  },
);

events.on(EventPresenter.formContactsEmail, ({ email }: { email: string }) => {
  buyerModel.buyerItem = { email };
});

events.on(EventPresenter.formContactsPhone, ({ phone }: { phone: string }) => {
  buyerModel.buyerItem = { phone };
});

events.on(EventPresenter.buyerChange, () => {
  const data = buyerModel.buyerItem;
  const errors = buyerModel.validateItem();

  const orderErrors: Partial<Record<keyof IFormOrder, string>> =
    Object.fromEntries(
      Object.entries(errors).filter((error) => {
        return ["payment", "address"].includes(error[0]);
      }),
    );

  const orderIsValid = Object.keys(orderErrors).length === 0;

  formOrder.render({
    payment: data?.payment ?? null,
    address: data?.address,
    errors: orderErrors,
    isValid: orderIsValid,
  });

  const contactsErrors: Partial<Record<keyof IFormContacts, string>> =
    Object.fromEntries(
      Object.entries(errors).filter((error) => {
        return ["email", "phone"].includes(error[0]);
      }),
    );

  const contactsIsValid = Object.keys(contactsErrors).length === 0;

  formContacts.render({
    email: data?.email,
    phone: data?.phone,
    errors: contactsErrors,
    isValid: contactsIsValid,
  });
});

events.on(EventPresenter.formOrderSubmit, () => {
  const data = buyerModel.buyerItem;
  const errors = buyerModel.validateItem();
  const contactsErrors: Partial<Record<keyof IFormContacts, string>> =
    Object.fromEntries(
      Object.entries(errors).filter((error) => {
        return ["email", "phone"].includes(error[0]);
      }),
    );

  const isValid = Object.keys(contactsErrors).length === 0;

  modal.render({
    content: formContacts.render({
      email: data?.email,
      phone: data?.phone,
      errors: contactsErrors,
      isValid: isValid,
    }),
  });
});

events.on(EventPresenter.formContactsSubmit, () => {
  const errors = buyerModel.validateItem();

  if (Object.keys(errors).length > 0) {
    return;
  }
  const data = buyerModel.buyerItem;
  const ids = basketModel.basketItems.map((item) => item.id);
  api
    .postOrder({
      ...data,
      total: basketModel.getTotalPrice,
      items: ids,
    })
    .then((res) => {
      buyerModel.clearItem();
      basketModel.clearBasket();
      modal.close();
      if ("total" in res) {
        modal.render({ content: successView.render({ total: res.total }) });
        modal.open();
      }
    })
    .catch();
});

events.on(EventPresenter.successSubmit, () => {
  modal.close();
});

events.on(EventPresenter.closeModal, () => {
  modal.close();
});
