import { Inject, Injectable } from '@nestjs/common';
import { SHOPEE_CONFIG } from './constants';
import { ShopeeConfig } from './shopee-config.interface';
import axios, { AxiosInstance } from 'axios';
import * as queryString from 'query-string';
import { generateQueryParams } from './util';

@Injectable()
export class ShopeeRequest {
  private static shopeeConfig: ShopeeConfig;
  constructor(@Inject(SHOPEE_CONFIG) private readonly configs: ShopeeConfig) {
    ShopeeRequest.shopeeConfig = configs;
  }

  static getInstance(): AxiosInstance {
    const instance = axios.create({
      baseURL: ShopeeRequest.shopeeConfig.host,
    });
    instance.interceptors.request.use(function (config) {
      const parsed = queryString.parseUrl('/api/v2/' + config.url);
      config.url =
        generateQueryParams(
          parsed.url,
          ShopeeRequest.shopeeConfig.partnerId.toString(),
          ShopeeRequest.shopeeConfig.partnerKey,
        ) +
        '&' +
        queryString.stringify(parsed.query);
      return config;
    });
    return instance;
  }

  static getShopInstance({
    shopId,
    token,
    onRefreshAccessToken,
  }: {
    shopId: number;
    token: string;
    onRefreshAccessToken?: () => Promise<string>;
  }): AxiosInstance {
    const instance = axios.create({
      baseURL: ShopeeRequest.shopeeConfig.host,
    });

    instance.interceptors.request.use(async function (config) {
      const parsed = queryString.parseUrl('/api/v2/' + config.url);
      config.url =
        generateQueryParams(
          parsed.url,
          ShopeeRequest.shopeeConfig.partnerId.toString(),
          ShopeeRequest.shopeeConfig.partnerKey,
          token,
          shopId,
        ) +
        '&' +
        queryString.stringify(parsed.query);
      return config;
    });

    // Add a response interceptor
    instance.interceptors.response.use(
      function (response) {
        return response;
      },
      async function (error) {
        if (
          error.response.data.error === 'error_auth' &&
          onRefreshAccessToken
        ) {
          const newToken = await onRefreshAccessToken();

          const currentUrl = error.config.url;
          const parsedUrl = queryString.parseUrl(currentUrl);
          const filteredQuery = [
            'access_token',
            'partner_id',
            'shop_id',
            'sign',
            'timestamp',
          ].reduce((acc, key) => {
            delete parsedUrl.query[key];
            return parsedUrl.query;
          }, {});

          const config = error.config;
          config.url =
            generateQueryParams(
              parsedUrl.url,
              ShopeeRequest.shopeeConfig.partnerId.toString(),
              ShopeeRequest.shopeeConfig.partnerKey,
              newToken,
              shopId,
            ) +
            '&' +
            queryString.stringify(parsedUrl.query);

          return axios.request(config);
        }
        return Promise.reject(error);
      },
    );
    return instance;
  }
}
