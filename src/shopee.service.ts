import { Inject, Injectable } from '@nestjs/common';
import { SHOPEE_CONFIG } from './constants';
import { ShopeeConfig } from './shopee-config.interface';
import { Auth } from './resources/auth';
import { ShopeeAuthResponseDto } from './dtos/shopee-auth.response.dto';
import { Shop } from './resources/shop';
import { ShopeeStoreUpdateDto } from './dtos/shopee-store.update.dto';

@Injectable()
export class ShopeeService {
  private readonly auth: Auth;
  private shop: Shop;
  constructor(@Inject(SHOPEE_CONFIG) private readonly shopeeConfig: ShopeeConfig) {
    this.auth = new Auth(shopeeConfig);
  }

  public generateAuthUrl(cancel: boolean = false): ShopeeAuthResponseDto {
    try {
      return this.auth.generateAuthLink(cancel);
    } catch (error) {
      throw error;
    }
  }

  public cancelAuthList(): string {
    try {
      return this.auth.cancelAuthList();
    } catch (error) {
      throw error;
    }
  }

  public async getAccessToken(code: string, shopId: number): Promise<any> {
    try {
      return this.auth.getAccessToken({ code, shop_id: shopId });
    } catch (error) {
      throw error;
    }
  }

  public async refreshAccessToken(refreshToken: string, shopId: number): Promise<any> {
    try {
      return this.auth.refreshAccessToken({ refresh_token: refreshToken, shop_id: shopId });
    } catch (error) {
      throw error;
    }
  }

  public async getShopsByPartner(pageSize?: number, pageNo?: number): Promise<any> {
    try {
      return this.auth.getStoresByPartner({ page_size: pageSize, page_no: pageNo });
    } catch (error) {
      throw error;
    }
  }

  public initializeShop(shopId: number, accessToken: string, onRefreshAccessToken?: () => Promise<string>) {
    this.shop = new Shop({
      shopId,
      accessToken,
      onRefreshAccessToken,
    });
  }

  private validateShop(shopId: number, accessToken: string) {
    if (!this.shop || this.shop.shopId !== shopId) {
      this.initializeShop(shopId, accessToken);
    }
  }

  public async getShopInfo(shopId: number, accessToken: string) {
    this.validateShop(shopId, accessToken);
    try {
      return await this.shop.getShopInfo();
    } catch (error) {
      throw error;
    }
  }

  public async getShopProfile(shopId: number, accessToken: string): Promise<any> {
    this.validateShop(shopId, accessToken);
    try {
      return await this.shop.getProfile();
    } catch (error) {
      throw error;
    }
  }

  public async updateShopProfile(shopId: number, accessToken: string, updateDto: ShopeeStoreUpdateDto): Promise<any> {
    this.validateShop(shopId, accessToken);
    try {
      return await this.shop.updateProfile(updateDto);
    } catch (error) {
      throw error;
    }
  }

  public async uploadImageToMediaSpace(shopId: number, accessToken: string, data: any, headers?: any): Promise<any> {
    this.validateShop(shopId, accessToken);
    try {
      return await this.shop.uploadImage({ data, headers });
    } catch (error) {
      throw error;
    }
  }

  public async getShopOrders(shopId: number, accessToken: string, params?: any): Promise<any> {
    this.validateShop(shopId, accessToken);
    try {
      return await this.shop.Order.getOderList(params);
    } catch (error) {
      throw error;
    }
  }
}
