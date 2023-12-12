import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {ShopeeConfig} from './shopee-config.interface';
@Injectable()
export class ShopeeConfigService {
    constructor(private readonly configService: ConfigService) { }

    getConfig(): ShopeeConfig {
        return {
            host: this.configService.get<string>('SHOPEE_HOST'),
            partnerId: +this.configService.get<string>('SHOPEE_PARTNER_ID'),
            partnerKey: this.configService.get<string>('SHOPEE_PARTNER_KEY'),
            redirect: this.configService.get<string>('SHOPEE_AUTH_REDIRECT_URL'),
        };
    }
}
