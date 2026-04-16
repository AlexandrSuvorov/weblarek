import { Cart } from './components/models/Cart.ts'
import { Catalog } from './components/models/Catalog'
import { Buyer } from './components/models/Buyer'
import { CatalogApi } from "./components/models/CatalogApi.ts";
import { apiProducts } from "./utils/data.ts";
import type { IBuyer } from "./types";
import { API_URL } from "./utils/constants.ts";
import { Api } from './components/base/Api.ts'


const catalog = new Catalog();

console.log('Вносим данные о товарах в каталог.')
catalog.catalogItems = apiProducts.items;
console.log('Проверяем наличие данных в каталоге:')
console.log(catalog.catalogItems);

console.log('Выбираем товар.')
catalog.selectedProduct = catalog.catalogItems[0]
console.log('Выводим выбранный товар:')
console.log(catalog.selectedProduct.id);

console.log('Выбираем товар по идентификатору:')
console.log(catalog.getSelectedItem(catalog.catalogItems[0].id));



const cart  = new Cart();

console.log('Пополняем корзину')
cart.addItem(catalog.selectedProduct);
cart.addItem(catalog.catalogItems[2]);
cart.addItem(catalog.catalogItems[3]);
console.log('Выводим корзину:')
console.log(cart.cartItems)

console.log('Выводим количество товаров в корзине:')
console.log(cart.getItemsCount)
console.log('Удаляем товар из корзины...')
cart.removeItem(catalog.catalogItems[0].id);
console.log(cart.cartItems)
console.log('Выводим количество товаров в корзине:')
console.log(cart.getItemsCount);

console.log('Проверяем наличие товара в корзине:')
console.log(cart.hasItem(catalog.catalogItems[2].id));

console.log('Очищаем корзину...')
cart.clearCart();

console.log('Выводим количество товаров в корзине:')
console.log(cart.cartItems);


const buyer = new Buyer();
const errorBuyer = new Buyer();

const exampleUser: IBuyer = {
    payment: 'cash',
    address: 'Москва',
    phone: '+79998765432',
    email: 'valerii-ostrovskii@gmail.com'
};

const exampleErrorBuyer: Partial<IBuyer> = {
    payment: 'card',
    address: 'Kazan'
}

console.log('Выводим пользователя со всеми заполнеными полями:')
buyer.buyerItem = exampleUser;
console.log(buyer.buyerItem);
console.log('Проверяем валидность полей...')
const errors = buyer.validateItem()
console.log(errors);

console.log('Выводим пользователя, у которого заполнены не все данные:')
errorBuyer.buyerItem = exampleErrorBuyer;
console.log(errorBuyer.buyerItem);
console.log('Проверяем валидность полей...')
const validateUser = errorBuyer.validateItem();
console.log(validateUser);

console.log('Очищаем данные пользователя')
buyer.clearItem();
console.log('Выводим пользователя с очищенными полями:')
console.log(buyer.buyerItem);


const api = new Api(API_URL);
const catalogService = new CatalogApi(api);

try {
    const catalogResponse = await catalogService.getCatalogProducts();
    catalog.catalogItems = catalogResponse.items;
    console.log('Вывод данных, пришедших с сервера:')
    console.log(catalog.catalogItems);
} catch (e) {
    console.error("Не удалось получить ответ от сервера", e);
}
