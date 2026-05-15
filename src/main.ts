import "./scss/styles.scss";

import { Basket } from "./components/models/Basket";
import { Buyer } from "./components/models/Buyer";
import { Catalog } from "./components/models/Catalog";

import { CardCatalog } from "./components/views/card/CardCatalog";
import { CardInBasket } from "./components/views/card/CardInBasket";
import { CardPreview } from "./components/views/card/CardPreview";

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

import { EventEmitter } from "./components/base/Events";
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

api
  .getCatalogItems()
  .then((data) => {
    catalogModel.catalogItems = data;
  })
  .catch();

const cardPreview = new CardPreview(cloneTemplate(cardPreviewTemplate), {
  onPurchaseClick: () => {
    events.emit("card:select");
  },
});

const formOrder = new FormOrder(cloneTemplate(orderFormTemplate), {
  paymentClick: (payment) => {
    events.emit("form-order:payment", { payment });
  },
  addressChange: (address) => {
    events.emit("form-order:address", { address });
  },
  submitClick: () => {
    events.emit("form-order:submit");
  },
});

const formContacts = new FormContacts(cloneTemplate(contactsFormTemplate), {
  emailChange: (email) => {
    events.emit("form-contacts:email", { email });
  },
  phoneChange: (phone) => {
    events.emit("form-contacts:phone", { phone });
  },
  submitClick: () => {
    events.emit("form-contacts:submit");
  },
});

const successView = new SuccessView(cloneTemplate(successTemplate), {
  closeButton: () => {
    events.emit(`success:submit`);
  },
});

events.on(`catalog:changed`, () => {
  const itemCards = catalogModel.catalogItems.map((item) => {
    const showCard = () => {
      events.emit(`card:select`, { product: item });
    };
    const card = new CardCatalog(cloneTemplate(cardCatalogTemplate), {
      showCard,
    });
    return card.render(item);
  });
  gallery.render({
    items: itemCards,
  });
});

events.on<{ product: IProduct }>(`card:select`, ({ product }) => {
  catalogModel.selectedProduct = product.id;
});

function getCardButton(product: IProduct, isInBasket: boolean) {
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

events.on("card:select", () => {
  const product = catalogModel.selectedProduct;
  if (product) {
    const isInBasket = basketModel.hasItem(product.id);
    const { buttonText, isDisabled } = getCardButton(product, isInBasket);

    const preview = cardPreview.render({ ...product, buttonText, isDisabled });
    modal.render({ element: preview });
    modal.open();
  }
});

events.on(`card-preview:change-click`, () => {
  const product = catalogModel.selectedProduct;
  if (product) {
    if (basketModel.hasItem(product.id)) {
      basketModel.removeItem(product.id);
    } else {
      basketModel.addItem(product);
    }
    modal.close();
  }
});

events.on(`basket:change`, () => {
  header.render({ counter: basketModel.getItemsCount });
  const selectedProduct = catalogModel.selectedProduct;
  if (selectedProduct) {
    const isInBasket = basketModel.hasItem(selectedProduct.id);
    const { buttonText, isDisabled } = getCardButton(
      selectedProduct,
      isInBasket,
    );
    cardPreview.render({ buttonText, isDisabled });
  }

  const cardBasketArray = basketModel.basketItems.map((item, index) => {
    const cardBasket = new CardInBasket(cloneTemplate(cardBasketTemplate), {
      deleteButtonElement: () => {
        events.emit(`basket:remove-product`, { product: item });
      },
    });
    return cardBasket.render({ ...item, index: index + 1 });
  });

  basket.render({
    basket: cardBasketArray,
    total: basketModel.getTotalPrice,
    buttonDisabled: basketModel.getItemsCount > 0,
  });
});

events.on(`basket:open`, () => {
  modal.render({
    element: basket.render({ buttonDisabled: basketModel.getItemsCount > 0 }),
  });
  modal.open();
});

events.on<{ product: IProduct }>(`basket:remove-product`, ({ product }) => {
  basketModel.removeItem(product.id);
  modal.render({ element: basket.render() });
});

events.on(`basket:order`, () => {
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
    element: formOrder.render({
      payment: data?.payment ?? null,
      address: data?.address ?? "",
      errors: orderErrors,
      buttonDisabled: isValid,
    }),
  });
});

events.on(`form-order:payment`, ({ payment }: { payment: TPayment }) => {
  buyerModel.buyerItem = { payment };
});

events.on(`form-order:address`, ({ address }: { address: string }) => {
  buyerModel.buyerItem = { address };
});

events.on(`form-contacts:email`, ({ email }: { email: string }) => {
  buyerModel.buyerItem = { email };
});

events.on(`form-contacts:phone`, ({ phone }: { phone: string }) => {
  buyerModel.buyerItem = { phone };
});

events.on(`buyer:change`, () => {
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
    buttonDisabled: orderIsValid,
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
    buttonDisabled: contactsIsValid,
  });
});

events.on(`form-order:submit`, () => {
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
    element: formContacts.render({
      email: data?.email,
      phone: data?.phone,
      errors: contactsErrors,
      buttonDisabled: isValid,
    }),
  });
});

events.on(`form-contacts:submit`, () => {
  const errors = buyerModel.validateItem();
  if (Object.keys(errors).length > 0) {
    return;
  }
  const data = buyerModel.buyerItem!;
  const ids = basketModel.basketItems.map((item) => item.id);

  api
    .postOrder({
      payment: data.payment! as TPayment,
      address: data.address!,
      phone: data.phone!,
      email: data.email!,
      total: basketModel.getTotalPrice,
      items: ids,
    })
    .then((res) => {
      buyerModel.clearItem();
      basketModel.clearBasket();
      modal.close();
      if ("total" in res) {
        modal.render({ element: successView.render({ total: res.total }) });
        modal.open();
      }
    })
    .catch();
});

events.on(`success:submit`, () => {
  modal.close();
});

events.on(`modal:close`, () => {
  modal.close();
});
