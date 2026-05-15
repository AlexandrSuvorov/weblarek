import { ICatalogFromApi, IOrder, IOrderResult, IProduct } from "../../types";
import { Api } from "../base/Api.ts";

export class CatalogApi {
  private api: Api;
  constructor(api: Api) {
    this.api = api;
  }
  getCatalogItems(): Promise<IProduct[]> {
    return this.api.get<ICatalogFromApi>("/product").then((data) => data.items);
  }
  postOrder(reqData: IOrder): Promise<IOrderResult> {
    return this.api.post<IOrderResult>("/order", reqData);
  }
}
