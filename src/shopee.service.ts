import { Inject, Injectable } from '@nestjs/common';
import { SHOPEE_CONFIG } from './constants';
import { ShopeeConfig } from './shopee-config.interface';
import { Auth } from './resources/auth';
import { ShopeeAuthResponseDto } from './dtos';
import { Shop } from './resources/shop';
import { ShopeeStoreUpdateDto } from './dtos';
import { ShopeeApiResponseDto } from './dtos';
import { ITEM_STATUS } from './dtos';

@Injectable()
export class ShopeeService {
  private readonly auth: Auth;
  private shop: Shop;
  private readonly configs: ShopeeConfig;
  constructor(@Inject(SHOPEE_CONFIG) private readonly shopeeConfig: ShopeeConfig) {
    this.configs = shopeeConfig;
    this.auth = new Auth(shopeeConfig);
  }

  /**
   * Generates a Shopee authentication URL.
   * @param {boolean} [cancel=false] - Whether to cancel the authentication.
   * @returns {ShopeeAuthResponseDto} The Shopee authentication response DTO.
   */
  public generateAuthUrl(cancel: boolean = false): ShopeeAuthResponseDto {
    try {
      return this.auth.generateAuthLink(cancel);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Cancels the Shopee authentication list.
   * @returns {string} A string indicating the cancellation status.
   */
  public cancelAuthList(): string {
    try {
      return this.auth.cancelAuthList();
    } catch (error) {
      throw error;
    }
  }

  /**
   * Retrieves an access token using provided code and shop ID.
   * @param {string} code - Authorization code.
   * @param {number} shopId - Shop ID.
   * @returns {Promise<any>} A promise resolving to the access token.
   */
  public async getAccessToken(code: string, shopId: number): Promise<any> {
    try {
      return this.auth.getAccessToken({ code, shop_id: shopId });
    } catch (error) {
      throw error;
    }
  }

  /**
   * Refreshes the access token using the provided refresh token and shop ID.
   * @param {string} refreshToken - The refresh token.
   * @param {number} shopId - The shop ID.
   * @returns {Promise<any>} A promise resolving to the refreshed access token.
   */
  public async refreshAccessToken(refreshToken: string, shopId: number): Promise<any> {
    try {
      return this.auth.refreshAccessToken({ refresh_token: refreshToken, shop_id: shopId });
    } catch (error) {
      throw error;
    }
  }

  /**
   * Retrieves shops by partner with optional pagination parameters.
   * @param {number} [pageSize] - The size of the page for pagination.
   * @param {number} [pageNo] - The page number for pagination.
   * @returns {Promise<any>} A promise resolving to the shops by partner.
   */
  public async getShopsByPartner(pageSize?: number, pageNo?: number): Promise<any> {
    try {
      return this.auth.getStoresByPartner({ page_size: pageSize, page_no: pageNo });
    } catch (error) {
      throw error;
    }
  }

  /**
   * Initializes a shop with provided shop ID, access token, and an optional refresh token function.
   * @param {number} shopId - The shop ID.
   * @param {string} accessToken - The access token.
   * @param {() => Promise<string>} [onRefreshAccessToken] - Optional function for refreshing access token.
   */
  public initializeShop(shopId: number, accessToken: string, onRefreshAccessToken?: () => Promise<string>) {
    this.shop = new Shop({
      shopeeConfig: this.configs,
      shopId,
      accessToken,
      onRefreshAccessToken,
    });
  }

  /**
   * Retrieves shop information using the shop ID and access token.
   * @param {number} shopId - The shop ID.
   * @param {string} accessToken - The access token.
   * @returns {Promise<any>} A promise resolving to the shop information.
   */
  public async getShopInfo(shopId: number, accessToken: string) {
    this.validateShop(shopId, accessToken);
    try {
      return await this.shop.getShopInfo();
    } catch (error) {
      throw error;
    }
  }

  /**
   * Retrieves shop profile using the shop ID and access token.
   * @param {number} shopId - The shop ID.
   * @param {string} accessToken - The access token.
   * @returns {Promise<any>} A promise resolving to the shop profile.
   */
  public async getShopProfile(shopId: number, accessToken: string): Promise<any> {
    this.validateShop(shopId, accessToken);
    try {
      return await this.shop.getProfile();
    } catch (error) {
      throw error;
    }
  }

  /**
   * Updates shop profile using the shop ID, access token, and update data.
   * @param {number} shopId - The shop ID.
   * @param {string} accessToken - The access token.
   * @param {ShopeeStoreUpdateDto} updateDto - The update data for the shop profile.
   * @returns {Promise<any>} A promise resolving to the updated shop profile.
   */
  public async updateShopProfile(shopId: number, accessToken: string, updateDto: ShopeeStoreUpdateDto): Promise<any> {
    this.validateShop(shopId, accessToken);
    try {
      return await this.shop.updateProfile(updateDto);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Uploads an image to the media space of a shop using shop ID, access token, data, and optional headers.
   * @param {number} shopId - The shop ID.
   * @param {string} accessToken - The access token.
   * @param {any} data - The data representing the image to be uploaded.
   * @param {any} [headers] - Optional headers for the upload request.
   * @returns {Promise<any>} A promise resolving to the uploaded image details.
   */
  public async uploadImageToMediaSpace(shopId: number, accessToken: string, data: any, headers?: any): Promise<any> {
    this.validateShop(shopId, accessToken);
    try {
      return await this.shop.uploadImage({ data, headers });
    } catch (error) {
      throw error;
    }
  }

  /**
   * Retrieves shop orders using the shop ID, access token, and optional parameters.
   * @param {number} shopId - The shop ID.
   * @param {string} accessToken - The access token.
   * @param {any} [params] - Optional parameters for fetching orders.
   * @returns {Promise<ShopeeApiResponseDto>} A promise resolving to the shop orders.
   */
  public async getShopOrders(shopId: number, accessToken: string, params?: any): Promise<ShopeeApiResponseDto> {
    this.validateShop(shopId, accessToken);
    try {
      return await this.shop.Order.getOderList(params);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Retrieves detailed shop order information using the shop ID, access token, order SN list, and optional fields.
   * @param {number} shopId - The shop ID.
   * @param {string} accessToken - The access token.
   * @param {string[]} orderSnList - List of order SNs.
   * @param {string[]} [responseOptionalFields] - Optional fields for the response.
   * @returns {Promise<ShopeeApiResponseDto>} A promise resolving to the detailed shop order information.
   */
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

  /**
   * Cancels a shop order using the shop ID, access token, order SN, cancel reason, and optional item list.
   * @param {number} shopId - The shop ID.
   * @param {string} accessToken - The access token.
   * @param {string} orderSn - The order SN.
   * @param {string} cancelReason - The reason for canceling the order.
   * @param {any[]} [itemList] - Optional list of items to cancel.
   * @returns {Promise<ShopeeApiResponseDto>} A promise resolving to the cancellation status.
   */
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

  /**
   * Retrieves shop order shipments using the shop ID, access token, and optional parameters.
   * @param {number} shopId - The shop ID.
   * @param {string} accessToken - The access token.
   * @param {any} [params] - Optional parameters for fetching order shipments.
   * @returns {Promise<ShopeeApiResponseDto>} A promise resolving to the shop order shipments.
   */
  public async getShopOrderShipments(shopId: number, accessToken: string, params?: any): Promise<ShopeeApiResponseDto> {
    this.validateShop(shopId, accessToken);
    try {
      return await this.shop.Order.getShipmentList(params);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Retrieves shipping parameters for a shop order using the shop ID, access token, and order SN.
   * @param {number} shopId - The shop ID.
   * @param {string} accessToken - The access token.
   * @param {string} orderSn - The order serial number.
   * @returns {Promise<ShopeeApiResponseDto>} A promise resolving to the shipping parameters.
   */
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

  /**
   * Ships a shop order using the shop ID, access token, order SN, package number, pickup, and drop-off details.
   * @param {number} shopId - The shop ID.
   * @param {string} accessToken - The access token.
   * @param {string} orderSn - The order serial number.
   * @param {string} packageNumber - The package number for the shipment.
   * @param {any} pickup - Details of the pickup.
   * @param {any} dropOff - Details of the drop-off.
   * @returns {Promise<ShopeeApiResponseDto>} A promise resolving to the shipped order status.
   */
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

  /**
   * Updates a shipped order using the shop ID, access token, order SN, package number, and pickup details.
   * @param {number} shopId - The shop ID.
   * @param {string} accessToken - The access token.
   * @param {string} orderSn - The order serial number.
   * @param {string} packageNumber - The package number for the shipment.
   * @param {any} pickup - Details of the pickup.
   * @returns {Promise<ShopeeApiResponseDto>} A promise resolving to the updated shipped order status.
   */
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

  /**
   * Batch ships multiple orders using the shop ID, access token, and a list of orders.
   * @param {number} shopId - The shop ID.
   * @param {string} accessToken - The access token.
   * @param {any[]} orderList - List of orders to be shipped.
   * @returns {Promise<ShopeeApiResponseDto>} A promise resolving to the batch shipped orders status.
   */
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

  /**
   * Creates a product using the shop ID, access token, and product parameters.
   * @param {number} shopId - The shop ID.
   * @param {string} accessToken - The access token.
   * @param {any} params - Parameters for creating the product.
   * @returns {Promise<any>} A promise resolving to the created product.
   */
  public async createProduct(shopId: number, accessToken: string, params: any): Promise<any> {
    this.validateShop(shopId, accessToken);
    try {
      return await this.shop.Product.addItem(params);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Updates a product using the shop ID, access token, and product parameters.
   * @param {number} shopId - The shop ID.
   * @param {string} accessToken - The access token.
   * @param {any} params - Parameters for updating the product.
   * @returns {Promise<ShopeeApiResponseDto>} A promise resolving to the updated product.
   */
  public async updateProduct(shopId: number, accessToken: string, params: any): Promise<ShopeeApiResponseDto> {
    this.validateShop(shopId, accessToken);
    try {
      return await this.shop.Product.updateItem(params);
    } catch (error) {
      throw error;
    }
  }
  /**
   * Retrieves categories using the shop ID, access token, and optional parameters.
   * @param {number} shopId - The shop ID.
   * @param {string} accessToken - The access token.
   * @param {any} [params] - Optional parameters for fetching categories.
   * @returns {Promise<ShopeeApiResponseDto>} A promise resolving to the fetched categories.
   */
  public async getCategories(shopId: number, accessToken: string, params?: any): Promise<ShopeeApiResponseDto> {
    this.validateShop(shopId, accessToken);
    try {
      return await this.shop.Product.getCategories(params);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Retrieves category attributes using the shop ID, access token, category ID, and optional language.
   * @param {number} shopId - The shop ID.
   * @param {string} accessToken - The access token.
   * @param {number} categoryId - The category ID.
   * @param {string} [language] - Optional language parameter for category attributes.
   * @returns {Promise<ShopeeApiResponseDto>} A promise resolving to the category attributes.
   */
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

  /**
   * Retrieves brands by category using the shop ID, access token, category ID, status, page size, and optional offset.
   * @param {number} shopId - The shop ID.
   * @param {string} accessToken - The access token.
   * @param {number} categoryId - The category ID.
   * @param {number} status - The status of the brands.
   * @param {number} pageSize - The number of brands per page.
   * @param {number} [offset] - Optional offset for paginated results.
   * @returns {Promise<ShopeeApiResponseDto>} A promise resolving to the retrieved brands.
   */
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

  /**
   * Retrieves a list of products using the shop ID, access token, page size, offset, status, and optional update time filters.
   * @param {number} shopId - The shop ID.
   * @param {string} accessToken - The access token.
   * @param {number} pageSize - The number of products per page.
   * @param {number} offset - The offset for paginated results.
   * @param {ITEM_STATUS[]} status - The status of the products.
   * @param {number} [updateTimeFrom] - Optional filter for product update time (from).
   * @param {number} [updateTimeTo] - Optional filter for product update time (to).
   * @returns {Promise<ShopeeApiResponseDto>} A promise resolving to the retrieved products.
   */
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

  /**
   * Retrieves product base information using the shop ID, access token, and product IDs.
   * @param {number} shopId - The shop ID.
   * @param {string} accessToken - The access token.
   * @param {number[]} productIds - The IDs of the products.
   * @returns {Promise<ShopeeApiResponseDto>} A promise resolving to the retrieved product base information.
   */
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

  /**
   * Retrieves additional product information using the shop ID, access token, and product IDs.
   * @param {number} shopId - The shop ID.
   * @param {string} accessToken - The access token.
   * @param {number[]} productIds - The IDs of the products.
   * @returns {Promise<ShopeeApiResponseDto>} A promise resolving to the retrieved additional product information.
   */
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
  /**
   * Retrieves product models using the shop ID, access token, and product ID.
   * @param {number} shopId - The shop ID.
   * @param {string} accessToken - The access token.
   * @param {number} productId - The ID of the product.
   * @returns {Promise<ShopeeApiResponseDto>} A promise resolving to the retrieved product models.
   */
  public async getProductModels(shopId: number, accessToken: string, productId: number): Promise<ShopeeApiResponseDto> {
    this.validateShop(shopId, accessToken);
    try {
      return await this.shop.Product.getModelList({ item_id: productId });
    } catch (error) {
      throw error;
    }
  }

  /**
   * Updates the price of a product identified by the shop ID, access token, product ID, and price list.
   * @param {number} shopId - The shop ID.
   * @param {string} accessToken - The access token.
   * @param {number} productId - The ID of the product.
   * @param {{ model_id?: number; original_price: number }[]} priceList - List of price updates for models.
   * @returns {Promise<ShopeeApiResponseDto>} A promise indicating the success of the price update.
   */
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

  /**
   * Updates the stock of a product identified by the shop ID, access token, product ID, and stock list.
   * @param {number} shopId - The shop ID.
   * @param {string} accessToken - The access token.
   * @param {number} productId - The ID of the product.
   * @param {{ model_id?: number; normal_stock: number }[]} stockList - List of stock updates for models.
   * @returns {Promise<ShopeeApiResponseDto>} A promise indicating the success of the stock update.
   */
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

  /**
   * Initializes the tier of a product by setting variations and models identified by the shop ID, access token, product ID,
   * tier variations, and model details.
   * @param {number} shopId - The shop ID.
   * @param {string} accessToken - The access token.
   * @param {number} productId - The ID of the product.
   * @param {{ name?: number; option_list: { option: string; image: { image_id: string } }[] }[]} tierVariations - List of tier variations.
   * @param {{ tier_index: number[]; normal_stock: number; original_price: number; model_sku: string }[]} model - List of model details.
   * @returns {Promise<ShopeeApiResponseDto>} A promise indicating the success of the tier initialization.
   */
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

  /**
   * Delists products by the shop ID, access token, and product list.
   * @param {number} shopId - The shop ID.
   * @param {string} accessToken - The access token.
   * @param {{ item_id: number; unlist: boolean }[]} productList - List of products to delist.
   * @returns {Promise<ShopeeApiResponseDto>} A promise indicating the success of delisting products.
   */
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

  /**
   * Retrieves logistic channels by the shop ID and access token.
   * @param {number} shopId - The shop ID.
   * @param {string} accessToken - The access token.
   * @returns {Promise<any>} A promise containing the retrieved logistic channels.
   */
  public async getLogisticChannels(shopId: number, accessToken: string): Promise<any> {
    this.validateShop(shopId, accessToken);
    try {
      return await this.shop.Logistic.getChannelList();
    } catch (error) {
      throw error;
    }
  }

  /**
   * Validates shop details and initializes if necessary.
   * @param {number} shopId - The shop ID.
   * @param {string} accessToken - The access token.
   */
  private validateShop(shopId: number, accessToken: string) {
    if (!this.shop || this.shop.shopId !== shopId) {
      this.initializeShop(shopId, accessToken);
    }
  }
}
