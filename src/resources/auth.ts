import { AxiosInstance } from 'axios';
import { ShopeeConfig } from '../shopee-config.interface';
import { ShopeeRequest } from '../shopee.request';
import { ShopeeAuthResponseDto } from '../dtos/shopee-auth.response.dto';
import { generateQueryParams } from '../util';

export class Auth {
  protected shopeeRequest: AxiosInstance;
  private readonly shopeeConfig: ShopeeConfig;
  constructor(private config: ShopeeConfig) {
    this.shopeeRequest = ShopeeRequest.getInstance();
    this.shopeeConfig = config;
  }

  /**
   * Generate shopee oauth link to authenticate with store credentials
   * @param cancel {boolean}
   * @returns authUrl {string}
   */
  public generateAuthLink(cancel: boolean = false): ShopeeAuthResponseDto {
    const apiPath = cancel ? '/api/v2/shop/cancel_auth_partner' : '/api/v2/shop/auth_partner';
    return {
      authUrl:
        this.shopeeConfig.host +
        generateQueryParams(apiPath, this.shopeeConfig.partnerId.toString(), this.shopeeConfig.partnerKey) +
        `&redirect=${this.shopeeConfig.redirect}`,
    };
  }

  /**
   * Cancel shopee auth request
   * @returns redirectUrl {string}
   */
  public cancelAuthList(): string {
    const apiPath = '/api/v2/shop/cancel_auth_partner';
    return (
      this.shopeeConfig.host +
      generateQueryParams(apiPath, this.shopeeConfig.partnerId.toString(), this.shopeeConfig.partnerKey) +
      `&redirect=${this.shopeeConfig.redirect}`
    );
  }

  /**
   * Get access_token from shopee
   * @param params {code : string, shop_id : number}
   * code : You should get from redirected url query
   * shop_id: You should get from redirected url query
   * @returns shopeeResponse {}
   */
  public async getAccessToken(params: { code: string; shop_id: number }): Promise<{
    access_token: string;
    error: string;
    request_id: string;
    message: string;
    expire_in: number;
    refresh_token: string;
  }> {
    const apiPath = 'auth/token/get';
    const result = await this.shopeeRequest.post(apiPath, {
      ...params,
      partner_id: this.shopeeConfig.partnerId,
    });
    return result.data;
  }

  /**
   * Refresh expired access_token
   * @param params {refresh_token: string; shop_id: number}
   * refresh_token : You got it already along with access_token
   * returns shopeeResponse {}
   */
  public async refreshAccessToken(params: { refresh_token: string; shop_id: number }): Promise<{
    shop_id: number;
    access_token: string;
    error: string;
    request_id: string;
    message: string;
    expire_in: number;
    refresh_token: string;
  }> {
    const apiPath = 'auth/access_token/get';
    const result = await this.shopeeRequest.post(apiPath, {
      ...params,
      partner_id: this.shopeeConfig.partnerId,
    });
    return result.data;
  }

  /**
   * Get all connected stores by partner in with pagination
   * @param params { page_size: number, page_no: number}
   * @returns shopeeResponse {}
   */
  public async getStoresByPartner(params?: { page_size?: number; page_no?: number }): Promise<{
    authed_shop_list: {
      region: string;
      shop_id: number;
      auth_time: number;
      expire_time: number;
      sip_affi_shop_list: { region: string; affi_shop_id: number }[];
    }[];
    request_id: string;
    more: boolean;
  }> {
    const apiPath = 'public/get_shops_by_partner';
    const result = await this.shopeeRequest.get(apiPath, { params });
    return result.data;
  }
}
