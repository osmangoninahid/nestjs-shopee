import { Inject, Injectable } from '@nestjs/common';
import { SHOPEE_CONFIG } from './constants';
import { ShopeeConfig } from './shopee-config.interface';

@Injectable()
export class ShopeeService {
  constructor(
    @Inject(SHOPEE_CONFIG) private readonly shopeeConfig: ShopeeConfig,
  ) {}

  public generateAuthLink(cancel: boolean = false, callbackUrl: string): any {
    return `TODO: need to implement generateShopeeAuthUrl`;
  }
}
