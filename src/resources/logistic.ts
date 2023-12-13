import { AxiosInstance } from 'axios';
export class Logistic {
  constructor(private http: AxiosInstance) {}

  /**
   * Get Store Logistics information
   * @param params
   * @returns {any}
   */
  async getChannelList(): Promise<any> {
    const apiPath = 'logistics/get_channel_list';
    const result = await this.http.get(apiPath, {});
    return result.data;
  }
}
