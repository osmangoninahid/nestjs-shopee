import { AxiosInstance } from 'axios';
import { ShopeeRequest } from '../shopee.request';
import { ShopeeStore } from '../dtos';
import { ShopeeStoreUpdateDto } from '../dtos';
import { Order } from './order';
import { Product } from './product';
import { Logistic } from './logistic';
import { ShopeeConfig } from '../shopee-config.interface';
export class Shop {
  protected shopeeRequest: AxiosInstance;
  public shopeeConfig: ShopeeConfig;
  public shopId: number;
  public accessToken: string;
  private order: Order;
  private product: Product;
  private logistic: Logistic;

  constructor(params: {
    shopeeConfig: ShopeeConfig;
    shopId: number;
    accessToken: string;
    onRefreshAccessToken?: () => Promise<string>;
  }) {
    this.shopId = params.shopId;
    this.accessToken = params.accessToken;
    this.shopeeRequest = ShopeeRequest.getAuthorizedInstance({
      shopeeConfig: params.shopeeConfig,
      shopId: params.shopId,
      token: params.accessToken,
      onRefreshAccessToken: params.onRefreshAccessToken,
    });
  }

  /**
   * Get store info from shopee
   * @returns shopeeStoreResponse {}
   */
  public async getShopInfo(): Promise<ShopeeStore> {
    const apiPath = 'shop/get_shop_info';
    const { data } = await this.shopeeRequest.get(apiPath);
    return data;
  }

  /**
   * Get shopee profile
   * @returns shopeeResponse {}
   */
  public async getProfile(): Promise<{
    error: string;
    message: string;
    response: any;
    request_id: string;
  }> {
    const apiPath = 'shop/get_profile';
    const { data } = await this.shopeeRequest.get(apiPath);
    return data;
  }

  /**
   * Update Store info/profile to shopee
   * @param updateDto {ShopeeStoreUpdateDto}
   * @returns {}
   */
  public async updateProfile(updateDto: ShopeeStoreUpdateDto): Promise<any> {
    const apiPath = 'shop/update_profile';
    const { data } = await this.shopeeRequest.post(apiPath, updateDto);
    return data;
  }

  /**
   * Upload Image to Shopee Media space to use the ref further
   * @param params {language : string}
   * @returns any {}
   */
  async uploadImage(params?: { data: any; headers: any }): Promise<any> {
    const apiPath = 'media_space/upload_image';
    const result = await this.shopeeRequest.post(apiPath, params.data, {
      headers: params.headers,
    });
    return result.data;
  }

  get Order() {
    if (!this.order) this.order = new Order(this.shopeeRequest);
    return this.order;
  }

  get Product() {
    if (!this.product) this.product = new Product(this.shopeeRequest);
    return this.product;
  }

  get Logistic() {
    if (!this.logistic) this.logistic = new Logistic(this.shopeeRequest);
    return this.logistic;
  }
}
