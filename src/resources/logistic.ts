import { AxiosInstance } from 'axios';
export class Logistic {
  constructor(private http: AxiosInstance) {}

  /**
   * Get Store Logistics information
   * @returns {any}
   */
  async getChannelList(): Promise<any> {
    const apiPath = 'logistics/get_channel_list';
    const result = await this.http.get(apiPath, {});
    return result.data;
  }
}
