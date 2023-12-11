import { Module, DynamicModule, Global } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {ShopeeService} from './shopee.service';
import {ShopeeConfig} from './shopee-config.interface';
import {SHOPEE_CONFIG} from './constants';
import {ShopeeConfigService} from './shopee-config.service';

@Global()
@Module({
    imports: [ConfigModule],
    providers: [ShopeeService],
    exports: [ShopeeService],
})
export class ShopeeModule {
    static forRoot(config: ShopeeConfig): DynamicModule {
        return {
            module: ShopeeModule,
            providers: [
                {
                    provide: SHOPEE_CONFIG,
                    useValue: config,
                },
            ],
        };
    }

    static forRootAsync(options: { useClass: any }): DynamicModule {
        return {
          module: ShopeeModule,
          providers: [
            {
              provide: SHOPEE_CONFIG,
              useFactory: async (shopeeConfigService: ShopeeConfigService) =>
                await shopeeConfigService.getConfig(),
              inject: [options.useClass, ConfigService],
            },
            options.useClass,
            ShopeeConfigService,
          ],
          imports: [ConfigModule], // Import ConfigModule to use ConfigService
        };
    }

    static register(config: ShopeeConfig): DynamicModule {
        return {
            module: ShopeeModule,
            providers: [
                {
                    provide: SHOPEE_CONFIG,
                    useValue: config,
                },
            ],
        };
    }

    static registerAsync(options): DynamicModule {
        return {
            module: ShopeeModule,
            providers: [
                {
                    provide: SHOPEE_CONFIG,
                    useFactory: async (shopeeConfigService: ShopeeConfigService) => await shopeeConfigService.getConfig(),
                    inject: [options.useClass, ConfigService, ...(options.inject || [])],
                },
                ...(options.useClass ? [options.useClass] : []),
                ShopeeConfigService,
            ],
            imports: [ConfigModule], // Import ConfigModule to use ConfigService
        };
    }
}
