import { AxiosInstance } from 'axios';
import { ShopeeApiResponseDto } from '../dtos';

export class Order {
  constructor(private shopeeRequest: AxiosInstance) {}
  /**
   * Get Order List
   * @param params {time_range_field : string,time_from: number, time_to: number, page_size:number, cursor:string, order_status: string}
   * @returns {ShopeeApiResponseDto}
   */
  async getOderList(params?: any): Promise<ShopeeApiResponseDto> {
    const apiPath = 'order/get_order_list';
    const result = await this.shopeeRequest.get(apiPath, {
      params,
    });
    return result.data;
  }

  /**
   * Get Order Details
   * @param params {order_sn_list : string[],response_optional_fields: string[]}
   * @returns {ShopeeApiResponseDto}
   */
  async getOderDetails(params?: any): Promise<ShopeeApiResponseDto> {
    const apiPath = 'order/get_order_detail';
    const result = await this.shopeeRequest.post(apiPath, {
      params,
    });
    return result.data;
  }

  /**
   * Cancel Order
   * @param params {order_sn : string,cancel_reason: string, item_list:[{item_id: number, model_id:number}]}
   * @returns {ShopeeApiResponseDto}
   */
  async cancelOrder(params?: any): Promise<ShopeeApiResponseDto> {
    const apiPath = 'order/cancel_order';
    const result = await this.shopeeRequest.post(apiPath, params);
    return result.data;
  }

  /**
   * Get Shipment List
   * @param params {cursor : string, page_size:number}
   * @returns {ShopeeApiResponseDto}
   */
  async getShipmentList(params?: any): Promise<ShopeeApiResponseDto> {
    const apiPath = 'order/get_shipment_list';
    const result = await this.shopeeRequest.get(apiPath, {
      params,
    });
    return result.data;
  }

  /**
   * Get Shipping Params
   * @param params {order_sn : string}
   * @returns {ShopeeApiResponseDto}
   */
  async getShippingParams(params?: any): Promise<ShopeeApiResponseDto> {
    const apiPath = 'logistics/get_shipping_parameter';
    const result = await this.shopeeRequest.get(apiPath, {
      params,
    });
    return result.data;
  }

  /**
   * Ship Order
   * @param params {order_sn : string,package_number: string, pickup: { address_id: number, pickup_time_id: string, tracking_number: string },
   * dropoff: { branch_id : number, sender_real_name: string, tracking_number: string, slug: string}, non_integrated: { tracking_number : string}}
   * @returns {ShopeeApiResponseDto}
   */
  async shipOrder(params?: any): Promise<ShopeeApiResponseDto> {
    const apiPath = 'logistics/ship_order';
    const result = await this.shopeeRequest.post(apiPath, {
      params,
    });
    return result.data;
  }

  /**
   * Update Ship Order
   * @param params {order_sn : string,package_number: string, pickup: { address_id: number, pickup_time_id: string}}
   * @returns {ShopeeApiResponseDto}
   */
  async updateShipOrder(params?: any): Promise<ShopeeApiResponseDto> {
    const apiPath = 'logistics/update_shipping_order';
    const result = await this.shopeeRequest.post(apiPath, {
      params,
    });
    return result.data;
  }

  /**
   * Batch Ship Order
   * @param params {order_list : {order_sn: string, package_number: string}[], pickup: { address_id: number, pickup_time_id: string,
   * tracking_number: string }, dropoff: { branch_id : number, sender_real_name: string, tracking_number: string},
   * non_integrated: { tracking_number : string}}
   * @returns {ShopeeApiResponseDto}
   */
  async batchShipOrder(params?: any): Promise<ShopeeApiResponseDto> {
    const apiPath = 'logistics/batch_ship_order';
    const result = await this.shopeeRequest.post(apiPath, {
      params,
    });
    return result.data;
  }
}
