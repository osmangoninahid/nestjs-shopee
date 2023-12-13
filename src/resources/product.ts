import { AxiosInstance } from 'axios';
import { ShopeeApiResponseDto } from '../dtos';
import { ITEM_STATUS } from '../dtos';

export class Product {
  constructor(private shopeeRequest: AxiosInstance) {}

  /**
   * Create Product
   * @param params {language : string}
   * @returns {ShopeeApiResponseDto}
   */
  async addItem(params?: any): Promise<any> {
    const apiPath = 'product/add_item';
    const result = await this.shopeeRequest.post(apiPath, params.data);
    return result.data;
  }

  /**
   * Update Product
   * @param params {language : string}
   * @returns {ShopeeApiResponseDto}
   */
  async updateItem(params?: any): Promise<ShopeeApiResponseDto> {
    const apiPath = 'product/update_item';
    const result = await this.shopeeRequest.post(apiPath, params.data);
    return result.data;
  }

  /**
   * Get category list
   * @param params {language : string}
   * @returns {ShopeeApiResponseDto}
   */
  async getCategories(params?: { language?: string }): Promise<ShopeeApiResponseDto> {
    const apiPath = 'product/get_category';
    const result = await this.shopeeRequest.get(apiPath, { params });
    return result.data;
  }

  /**
   * Get attributes for a category to insert product
   * @param params { language : string, category_id: number}
   * @returns {ShopeeApiResponseDto}
   */
  async getAttributes(params: { language?: string; category_id: number }): Promise<ShopeeApiResponseDto> {
    const apiPath = 'product/get_attributes';
    const result = await this.shopeeRequest.get(apiPath, { params });
    return result.data;
  }

  /**
   * Get a paginated Brand list for a category
   * @param params {status: string, category_id: number, page_size: number, offset: number}
   * @returns {ShopeeApiResponseDto}
   */
  async getBrandList(params: {
    status: number;
    category_id: number;
    page_size: number;
    offset?: number;
  }): Promise<ShopeeApiResponseDto> {
    const apiPath = 'product/get_brand_list';
    const result = await this.shopeeRequest.get(apiPath, {
      params,
    });
    return result.data;
  }

  /**
   * Get Item list for a shop
   * @param params {offset: number, page_size: number, update_time_from: number, update_time_to: number, item_status: [{ITEM_STATUS}]}
   * @returns {ShopeeApiResponseDto}
   */
  async getItemList(params: {
    offset: number;
    page_size: number;
    update_time_from?: number;
    update_time_to?: number;
    item_status: ITEM_STATUS[];
  }): Promise<ShopeeApiResponseDto> {
    const apiPath = 'product/get_item_list';

    const searchParam = new URLSearchParams();
    params.item_status.map((status) => {
      searchParam.append('item_status', status);
    });

    params.page_size !== 0
      ? searchParam.append('page_size', params.page_size.toString())
      : searchParam.append('page_size', '0');
    params.update_time_from ? searchParam.append('update_time_from', params.update_time_from.toString()) : '';
    params.update_time_to ? searchParam.append('update_time_to', params.update_time_to.toString()) : '';
    params.offset !== 0 ? searchParam.append('offset', params.offset.toString()) : searchParam.append('offset', '0');

    const result = await this.shopeeRequest.get(`${apiPath}?${searchParam}`);
    return result.data;
  }

  /**
   * Get a product item information providing by list of item ids
   * @param params { item_id_list : [number]}
   * @returns {ShopeeApiResponseDto}
   */
  async getItemBaseInfo(params: { item_id_list: number[] }): Promise<ShopeeApiResponseDto> {
    const apiPath = 'product/get_item_base_info';
    const result = await this.shopeeRequest.get(apiPath, {
      params: {
        item_id_list: params.item_id_list.join(','),
      },
    });
    return result.data;
  }

  /**
   * Get extra info for a product item by ids list
   * @param params { item_id_list : [number]}
   * @returns {ShopeeApiResponseDto}
   */
  async getItemExtraInfo(params: { item_id_list: number[] }): Promise<ShopeeApiResponseDto> {
    const apiPath = 'product/get_item_extra_info';
    const result = await this.shopeeRequest.get(apiPath, {
      params: {
        item_id_list: params.item_id_list.join(','),
      },
    });
    return result.data;
  }

  /**
   * Get models for a product item / combinations of variants
   * @param params { item_id : number}
   * @returns {ShopeeApiResponseDto}
   */
  async getModelList(params: { item_id: number }): Promise<ShopeeApiResponseDto> {
    const apiPath = 'product/get_model_list';
    const result = await this.shopeeRequest.get(apiPath, {
      params,
    });
    return result.data;
  }

  /**
   * Update stock for an item to the store
   * @param params {item_id: number; price_list {model_id?: number; original_price: number}[]}
   * @returns {ShopeeApiResponseDto}
   */
  async updatePrice(params: {
    item_id: number;
    price_list: { model_id?: number; original_price: number }[];
  }): Promise<ShopeeApiResponseDto> {
    const apiPath = 'product/update_price';
    const result = await this.shopeeRequest.post(apiPath, params);
    return result.data;
  }

  /**
   * Update stock for an item to the store
   * @param params {item_id: number; stock_list {model_id?: number; normal_stock: number}[]}
   * @returns {ShopeeApiResponseDto}
   */
  async updateStock(params: {
    item_id: number;
    stock_list: { model_id?: number; normal_stock: number }[];
  }): Promise<ShopeeApiResponseDto> {
    const apiPath = 'product/update_stock';
    const result = await this.shopeeRequest.post(apiPath, params);
    return result.data;
  }

  /**
   * Initialize tier variation
   * @param params { item_id: number; tier_variation: { name?: number; option_list: {option: string,image:{image_id:string}}[] }[],
   * model:{tier_index:number[],normal_stock:number,original_price:number,model_sku:string}[] }
   * @returns {ShopeeApiResponseDto}
   */
  async initializeTier(params: {
    item_id: number;
    tier_variation: { name?: number; option_list: { option: string; image: { image_id: string } }[] }[];
    model: { tier_index: number[]; normal_stock: number; original_price: number; model_sku: string }[];
  }): Promise<ShopeeApiResponseDto> {
    const apiPath = 'product/init_tier_variation';
    const result = await this.shopeeRequest.post(apiPath, params);
    return result.data;
  }

  /**
   * Upload Product Image
   * @param params {language : string}
   * @returns {ShopeeApiResponseDto}
   */
  async uploadImage(params?: { data: any; headers: any }): Promise<ShopeeApiResponseDto> {
    const apiPath = 'media_space/upload_image';
    const result = await this.shopeeRequest.post(apiPath, params.data, { headers: params.headers });
    return result.data;
  }

  /**
   * Re Publish and Unpublish Product
   * @param params { item_list: { item_id: number; unlist: boolean }[] })
   * @returns {ShopeeApiResponseDto}
   */
  async unlist_item(params: { item_list: { item_id: number; unlist: boolean }[] }): Promise<ShopeeApiResponseDto> {
    const apiPath = 'product/unlist_item';
    const result = await this.shopeeRequest.post(apiPath, params);
    return result.data;
  }
}
