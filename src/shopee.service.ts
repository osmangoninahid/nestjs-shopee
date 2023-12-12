import { Inject, Injectable } from '@nestjs/common';
import { SHOPEE_CONFIG } from './constants';
import { ShopeeConfig } from './shopee-config.interface';
import { Auth } from './resources/auth';
import { ShopeeAuthResponseDto } from './dtos/shopee-auth.response.dto';

@Injectable()
export class ShopeeService {
  constructor(
    @Inject(SHOPEE_CONFIG) private readonly shopeeConfig: ShopeeConfig,
    private readonly auth: Auth,
  ) {}

  public generateAuthUrl(cancel: boolean = false): ShopeeAuthResponseDto {
    return this.auth.generateAuthLink(cancel);
  }

  public cancelAuthList(): string {
    return this.auth.cancelAuthList();
  }

  public async getAccessToken(code: string, shopId: number): Promise<any> {
    return this.auth.getAccessToken({ code, shop_id: shopId });
  }

  public async refreshAccessToken(refreshToken: string, shopId: number): Promise<any> {
    return this.auth.refreshAccessToken({ refresh_token: refreshToken, shop_id: shopId });
  }

  public async getShopsByPartner(pageSize?: number, pageNo?: number): Promise<any> {
    return this.auth.getStoresByPartner({ page_size: pageSize, page_no: pageNo });
  }
}
