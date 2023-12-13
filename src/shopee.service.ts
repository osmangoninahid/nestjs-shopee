import { Inject, Injectable } from '@nestjs/common';
import { SHOPEE_CONFIG } from './constants';
import { ShopeeConfig } from './shopee-config.interface';
import { Auth } from './resources/auth';
import { ShopeeAuthResponseDto } from './dtos/shopee-auth.response.dto';
import { Shop } from './resources/shop';
import { ShopeeStoreUpdateDto } from './dtos/shopee-store.update.dto';
import { ShopeeApiResponseDto } from './dtos/shopee-api.response.dto';
import { ITEM_STATUS } from './dtos/item-status.enum';

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

  public async getShopOrders(shopId: number, accessToken: string, params?: any): Promise<ShopeeApiResponseDto> {
    this.validateShop(shopId, accessToken);
    try {
      return await this.shop.Order.getOderList(params);
    } catch (error) {
      throw error;
    }
  }

  public async getShopOrderDetail(
    shopId: number,
    accessToken: string,
    orderSnList: string[],
    responseOptionalFields?: string[],
  ): Promise<ShopeeApiResponseDto> {
    this.validateShop(shopId, accessToken);
    try {
      return await this.shop.Order.getOderDetails({
        order_sn_list: orderSnList,
        response_optional_fields: responseOptionalFields,
      });
    } catch (error) {
      throw error;
    }
  }

  public async cancelShopOrder(
    shopId: number,
    accessToken: string,
    orderSn: string,
    cancelReason: string,
    itemList?: any[],
  ): Promise<ShopeeApiResponseDto> {
    this.validateShop(shopId, accessToken);
    try {
      return await this.shop.Order.cancelOrder({ order_sn: orderSn, cancel_reason: cancelReason, item_list: itemList });
    } catch (error) {
      throw error;
    }
  }

  public async getShopOrderShipments(shopId: number, accessToken: string, params?: any): Promise<ShopeeApiResponseDto> {
    this.validateShop(shopId, accessToken);
    try {
      return await this.shop.Order.getShipmentList(params);
    } catch (error) {
      throw error;
    }
  }

  public async getShippingParameters(
    shopId: number,
    accessToken: string,
    orderSn: string,
  ): Promise<ShopeeApiResponseDto> {
    this.validateShop(shopId, accessToken);
    try {
      return await this.shop.Order.getShippingParams({ order_sn: orderSn });
    } catch (error) {
      throw error;
    }
  }

  public async shipOrder(
    shopId: number,
    accessToken: string,
    orderSn: string,
    packageNumber: string,
    pickup: any,
    dropOff: any,
  ): Promise<ShopeeApiResponseDto> {
    this.validateShop(shopId, accessToken);
    try {
      return await this.shop.Order.shipOrder({
        order_sn: orderSn,
        package_number: packageNumber,
        pickup,
        dropoff: dropOff,
      });
    } catch (error) {
      throw error;
    }
  }

  public async updateShipOrder(
    shopId: number,
    accessToken: string,
    orderSn: string,
    packageNumber: string,
    pickup: any,
  ): Promise<ShopeeApiResponseDto> {
    this.validateShop(shopId, accessToken);
    try {
      return await this.shop.Order.updateShipOrder({
        order_sn: orderSn,
        package_number: packageNumber,
        pickup,
      });
    } catch (error) {
      throw error;
    }
  }

  public async batchShipOrder(shopId: number, accessToken: string, orderList: any[]): Promise<ShopeeApiResponseDto> {
    this.validateShop(shopId, accessToken);
    try {
      return await this.shop.Order.batchShipOrder({
        order_list: orderList,
      });
    } catch (error) {
      throw error;
    }
  }

  public async createProduct(shopId: number, accessToken: string, params: any): Promise<any> {
    this.validateShop(shopId, accessToken);
    try {
      return await this.shop.Product.addItem(params);
    } catch (error) {
      throw error;
    }
  }

  public async updateProduct(shopId: number, accessToken: string, params: any): Promise<ShopeeApiResponseDto> {
    this.validateShop(shopId, accessToken);
    try {
      return await this.shop.Product.updateItem(params);
    } catch (error) {
      throw error;
    }
  }

  public async getCategories(shopId: number, accessToken: string, params?: any): Promise<ShopeeApiResponseDto> {
    this.validateShop(shopId, accessToken);
    try {
      return await this.shop.Product.getCategories(params);
    } catch (error) {
      throw error;
    }
  }

  public async getCategoryAttributes(
    shopId: number,
    accessToken: string,
    categoryId: number,
    language?: string,
  ): Promise<ShopeeApiResponseDto> {
    this.validateShop(shopId, accessToken);
    try {
      return await this.shop.Product.getAttributes({ category_id: categoryId, language });
    } catch (e) {
      throw e;
    }
  }

  public async getBrandsByCategory(
    shopId: number,
    accessToken: string,
    categoryId: number,
    status: number,
    pageSize: number,
    offset?: number,
  ): Promise<ShopeeApiResponseDto> {
    this.validateShop(shopId, accessToken);
    try {
      return await this.shop.Product.getBrandList({ status, category_id: categoryId, page_size: pageSize, offset });
    } catch (error) {
      throw error;
    }
  }

  public async getProductList(
    shopId: number,
    accessToken: string,
    pageSize: number,
    offset: number,
    status: ITEM_STATUS[],
    updateTimeFrom?: number,
    updateTimeTo?: number,
  ): Promise<ShopeeApiResponseDto> {
    this.validateShop(shopId, accessToken);
    try {
      return await this.shop.Product.getItemList({
        offset,
        page_size: pageSize,
        item_status: status,
        update_time_from: updateTimeFrom,
        update_time_to: updateTimeTo,
      });
    } catch (error) {
      throw error;
    }
  }

  public async getProductBaseInfo(
    shopId: number,
    accessToken: string,
    productIds: number[],
  ): Promise<ShopeeApiResponseDto> {
    this.validateShop(shopId, accessToken);
    try {
      return await this.shop.Product.getItemBaseInfo({ item_id_list: productIds });
    } catch (error) {
      throw error;
    }
  }

  public async getProductExtraInfo(
    shopId: number,
    accessToken: string,
    productIds: number[],
  ): Promise<ShopeeApiResponseDto> {
    this.validateShop(shopId, accessToken);
    try {
      return await this.shop.Product.getItemExtraInfo({ item_id_list: productIds });
    } catch (error) {
      throw error;
    }
  }

  public async getProductModels(shopId: number, accessToken: string, productId: number): Promise<ShopeeApiResponseDto> {
    this.validateShop(shopId, accessToken);
    try {
      return await this.shop.Product.getModelList({ item_id: productId });
    } catch (error) {
      throw error;
    }
  }

  public async updateProductPrice(
    shopId: number,
    accessToken: string,
    productId: number,
    priceList: { model_id?: number; original_price: number }[],
  ): Promise<ShopeeApiResponseDto> {
    this.validateShop(shopId, accessToken);
    try {
      return await this.shop.Product.updatePrice({ item_id: productId, price_list: priceList });
    } catch (error) {
      throw error;
    }
  }

  public async updateProductStock(
    shopId: number,
    accessToken: string,
    productId: number,
    stockList: { model_id?: number; normal_stock: number }[],
  ): Promise<ShopeeApiResponseDto> {
    this.validateShop(shopId, accessToken);
    try {
      return await this.shop.Product.updateStock({ item_id: productId, stock_list: stockList });
    } catch (error) {
      throw error;
    }
  }

  public async initProductTier(
    shopId: number,
    accessToken: string,
    productId: number,
    tierVariations: { name?: number; option_list: { option: string; image: { image_id: string } }[] }[],
    model: { tier_index: number[]; normal_stock: number; original_price: number; model_sku: string }[],
  ): Promise<ShopeeApiResponseDto> {
    this.validateShop(shopId, accessToken);
    try {
      return await this.shop.Product.initializeTier({ item_id: productId, tier_variation: tierVariations, model });
    } catch (error) {
      throw error;
    }
  }

  public async delistProduct(
    shopId: number,
    accessToken: string,
    productList: { item_id: number; unlist: boolean }[],
  ): Promise<ShopeeApiResponseDto> {
    this.validateShop(shopId, accessToken);
    try {
      return await this.shop.Product.unlist_item({ item_list: productList });
    } catch (error) {
      throw error;
    }
  }

  public async getLogisticChannels(shopId: number, accessToken: string): Promise<any> {
    this.validateShop(shopId, accessToken);
    try {
      return await this.shop.Logistic.getChannelList();
    } catch (error) {
      throw error;
    }
  }
}
