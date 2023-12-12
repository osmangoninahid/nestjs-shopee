import { AxiosInstance } from 'axios';
import { ShopeeRequest } from '../shopee.request';
import { ShopeeStore } from '../dtos/shopee-store.dto';
import { ShopeeStoreUpdateDto } from '../dtos/shopee-store.update.dto';
export class Shop {
  protected shopeeRequest: AxiosInstance;
  public shopId: number;
  public accessToken: string;

  constructor(params: { shopId: number; accessToken: string; onRefreshAccessToken?: () => Promise<string> }) {
    this.shopId = params.shopId;
    this.accessToken = params.accessToken;
    this.shopeeRequest = ShopeeRequest.getAuthorizedInstance({
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
}
