# @osmangoninahid/nestjs-shopee

Interacting with the [Shopee Open API](https://open.shopee.com/) v2.x in your NestJS applications made easy 🥧

<p align="center">
<a href="https://www.npmjs.com/package/@osmangoninahid/nestjs-shopee"><img src="https://img.shields.io/npm/v/@osmangoninahid/nestjs-shopee.svg?style=flat" alt="version" /></a>
<a href="https://www.npmjs.com/package/@osmangoninahid/nestjs-shopee"><img alt="downloads" src="https://img.shields.io/npm/dt/@osmangoninahid/nestjs-shopee.svg?style=flat"></a>
<img alt="license" src="https://img.shields.io/npm/l/@osmangoninahid/nestjs-shopee.svg">
</p>

## Features

- 💉 Injectable Shopee Service/Client for interacting with the Shopee API in Controllers and Providers

- 🔒 Shopee Authentication & Authorization
- 🔒 Shopee Store Management
- 🔒 Shopee Order & Shipping Management (Order list, detail, ship, cancellation)
- 🔒 Shopee Product and Inventory Management

## Getting Started

### Install

#### NPM

- Install the package along with the peer dependency

  `npm install --save @osmangoninahid/nestjs-shopee`

#### YARN

- Install the package using yarn with the peer dependency

  `yarn add @osmangoninahid/nestjs-shopee`

### Configuration

Your `SHOPEE_HOST`, `SHOPEE_PARTNER_ID`, `SHOPEE_PARTNER_KEY` and `SHOPEE_AUTH_REDIRECT_URL` API credentials are required into your `.env` or `config`

### Import

Import and add `ShopeeModule` to the `imports` section of the consuming module (most likely `AppModule`).

```typescript
import { ShopeeModule } from '@osmangoninahid/nestjs-shopee';

@Module({
  imports: [
    ShopeeModule.register({
      host: 'SHOPEE_HOST',
      partnerId: 'SHOPEE_PARTNER_ID',
      partnerKey: 'SHOPEE_PARTNER_KEY',
      redirect: 'SHOPEE_AUTH_REDIRECT_URL',
    }),
  ],
})
export class AppModule {
  // ...
}
```

### Injectable Providers

The module exposes injectable `ShopeeService` as provider

### Usage

```typescript
import { ShopeeService } from '@osmangoninahid/nestjs-shopee';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  constructor(private readonly shopeeService: ShopeeService) {}

  getShop(shopId: number, accessToken: string): any {
    return this.shopeeService.getShopInfo(shopId, accessToken);
  }
}
```

or

```typescript
import { ShopeeService } from '@osmangoninahid/nestjs-shopee';

@Controller()
export class AppController {
  constructor(private readonly shopeeService: ShopeeService) {}

  @Get()
  getHello(): any {
    const shopId: number = 123;
    const accesstoken: string = 'xyz';
    return this.evalyService.authenticate(shopId, accesstoken);
  }
}
```

### API

#### Authentication

##### `generateAuthUrl(cancel?: boolean): ShopeeAuthResponseDto`
Generates the authentication URL for Shopee.

- **Parameters:**
  - `cancel` (optional): `boolean` - Cancels the authentication process if set to `true`.

---

##### `cancelAuthList(): string`
- Cancels the authentication list.

---

##### `getAccessToken(code: string, shopId: number): Promise<any>`

Gets the access token for the specified code and shop ID.

- **Parameters:**
  - `code`: `string` - Authentication code.
  - `shopId`: `number` - ID of the shop.

---

##### `refreshAccessToken(refreshToken: string, shopId: number): Promise<any>`

Refreshes the access token using the refresh token and shop ID.

- **Parameters:**
  - `refreshToken`: `string` - Refresh token for authentication renewal.
  - `shopId`: `number` - ID of the shop.

---

#### Shop Management

##### `getShopsByPartner(pageSize?: number, pageNo?: number): Promise<any>`

Retrieve shops associated with the partner.

- **Parameters:**
  - `pageSize` (optional): `number` - Number of shops per page.
  - `pageNo` (optional): `number` - Page number.

---

##### `initializeShop(shopId: number, accessToken: string, onRefreshAccessToken?: () => Promise<string>): void`

Initializes the shop with the provided ID and access token.

- **Parameters:**
  - `shopId`: `number` - ID of the shop.
  - `accessToken`: `string` - Access token for shop authentication.
  - `onRefreshAccessToken` (optional): `() => Promise<string>` - Function to refresh access token.

---
##### `getShopInfo(shopId: number, accessToken: string): Promise<any>`

Retrieves information about the shop.

- **Parameters:**
  - `shopId`: `number` - ID of the shop.
  - `accessToken`: `string` - Access token for shop authentication.

---

##### `getShopProfile(shopId: number, accessToken: string): Promise<any>`

Retrieves the profile of the shop.

- **Parameters:**
  - `shopId`: `number` - ID of the shop.
  - `accessToken`: `string` - Access token for shop authentication.

---

##### `updateShopProfile(shopId: number, accessToken: string, updateDto: ShopeeStoreUpdateDto): Promise<any>`

Updates the profile of the shop.

- **Parameters:**
  - `shopId`: `number` - ID of the shop.
  - `accessToken`: `string` - Access token for shop authentication.
  - `updateDto`: `ShopeeStoreUpdateDto` - Updated store information.

---

##### `uploadImageToMediaSpace(shopId: number, accessToken: string, data: any, headers?: any): Promise<any>`

Uploads an image to the shop's media space.

- **Parameters:**
  - `shopId`: `number` - ID of the shop.
  - `accessToken`: `string` - Access token for shop authentication.
  - `data`: `any` - Image data to be uploaded.
  - `headers` (optional): `any` - Additional headers for the upload.
---
### Order & Shipping Management

##### `getShopOrders(shopId: number, accessToken: string, params?: any): Promise<ShopeeApiResponseDto>`

Retrieve orders for the shop.

- **Parameters:**
  - `shopId`: `number` - ID of the shop.
  - `accessToken`: `string` - Access token for shop authentication.
  - `params` (optional): `any` - Additional parameters for filtering orders.

---

##### `getShopOrderDetail(shopId: number, accessToken: string, orderSnList: string[], responseOptionalFields?: string[]): Promise<ShopeeApiResponseDto>`

Retrieves detailed information about specific shop orders.

- **Parameters:**
  - `shopId`: `number` - ID of the shop.
  - `accessToken`: `string` - Access token for shop authentication.
  - `orderSnList`: `string[]` - List of order serial numbers.
  - `responseOptionalFields` (optional): `string[]` - Optional fields to include in the response.

---

##### `cancelShopOrder(shopId: number, accessToken: string, orderSn: string, cancelReason: string, itemList?: any[]): Promise<ShopeeApiResponseDto>`

Cancels a shop order.

- **Parameters:**
  - `shopId`: `number` - ID of the shop.
  - `accessToken`: `string` - Access token for shop authentication.
  - `orderSn`: `string` - Serial number of the order to be canceled.
  - `cancelReason`: `string` - Reason for cancellation.
  - `itemList` (optional): `any[]` - List of items to be canceled.

---

##### `getShopOrderShipments(shopId: number, accessToken: string, params?: any): Promise<ShopeeApiResponseDto>`

Retrieves shipment details for shop orders.

- **Parameters:**
  - `shopId`: `number` - ID of the shop.
  - `accessToken`: `string` - Access token for shop authentication.
  - `params` (optional): `any` - Additional parameters for filtering shipments.

---

##### `getShippingParameters(shopId: number, accessToken: string, orderSn: string): Promise<ShopeeApiResponseDto>`

Retrieves shipping parameters for a specific order.

- **Parameters:**
  - `shopId`: `number` - ID of the shop.
  - `accessToken`: `string` - Access token for shop authentication.
  - `orderSn`: `string` - Serial number of the order.

---

##### `shipOrder(shopId: number, accessToken: string, orderSn: string, packageNumber: string, pickup: any, dropOff: any): Promise<ShopeeApiResponseDto>`

Initiates shipping for an order.

- **Parameters:**
  - `shopId`: `number` - ID of the shop.
  - `accessToken`: `string` - Access token for shop authentication.
  - `orderSn`: `string` - Serial number of the order to be shipped.
  - `packageNumber`: `string` - Package number for tracking.
  - `pickup`: `any` - Details about pickup.
  - `dropOff`: `any` - Details about drop-off.

---

##### `updateShipOrder(shopId: number, accessToken: string, orderSn: string, packageNumber: string, pickup: any): Promise<ShopeeApiResponseDto>`

Updates shipping details for an order.

- **Parameters:**
  - `shopId`: `number` - ID of the shop.
  - `accessToken`: `string` - Access token for shop authentication.
  - `orderSn`: `string` - Serial number of the order.
  - `packageNumber`: `string` - Package number for tracking.
  - `pickup`: `any` - Updated pickup details.

---

##### `batchShipOrder(shopId: number, accessToken: string, orderList: any[]): Promise<ShopeeApiResponseDto>`

Processes batch shipping for multiple orders.

- **Parameters:**
  - `shopId`: `number` - ID of the shop.
  - `accessToken`: `string` - Access token for shop authentication.
  - `orderList`: `any[]` - List of orders to be shipped in a batch.

---

### Product and Inventory 

##### `createProduct(shopId: number, accessToken: string, params: any): Promise<any>`

Creates a new product in the shop.

- **Parameters:**
  - `shopId`: `number` - ID of the shop.
  - `accessToken`: `string` - Access token for shop authentication.
  - `params`: `any` - Parameters for creating the product.

---

##### `updateProduct(shopId: number, accessToken: string, params: any): Promise<ShopeeApiResponseDto>`

Updates an existing product in the shop.

- **Parameters:**
  - `shopId`: `number` - ID of the shop.
  - `accessToken`: `string` - Access token for shop authentication.
  - `params`: `any` - Parameters for updating the product.

---

##### `getCategories(shopId: number, accessToken: string, params?: any): Promise<ShopeeApiResponseDto>`

Retrieves categories for products in the shop.

- **Parameters:**
  - `shopId`: `number` - ID of the shop.
  - `accessToken`: `string` - Access token for shop authentication.
  - `params` (optional): `any` - Additional parameters for filtering categories.

---
##### `getCategoryAttributes(shopId: number, accessToken: string, categoryId: number, language?: string): Promise<ShopeeApiResponseDto>`

Retrieve attributes of a specific category in the shop.

- **Parameters:**
  - `shopId`: `number` - ID of the shop.
  - `accessToken`: `string` - Access token for shop authentication.
  - `categoryId`: `number` - ID of the category.
  - `language` (optional): `string` - Language code for the attributes.

---

##### `getBrandsByCategory(shopId: number, accessToken: string, categoryId: number, status: number, pageSize: number, offset?: number): Promise<ShopeeApiResponseDto>`

Retrieve brands associated with a specific category in the shop.

- **Parameters:**
  - `shopId`: `number` - ID of the shop.
  - `accessToken`: `string` - Access token for shop authentication.
  - `categoryId`: `number` - ID of the category.
  - `status`: `number` - Status of the brands.
  - `pageSize`: `number` - Number of brands per page.
  - `offset` (optional): `number` - Offset for pagination.

---

##### `getProductList(shopId: number, accessToken: string, pageSize: number, offset: number, status: ITEM_STATUS[], updateTimeFrom?: number, updateTimeTo?: number): Promise<ShopeeApiResponseDto>`

Retrieves a list of products in the shop.

- **Parameters:**
  - `shopId`: `number` - ID of the shop.
  - `accessToken`: `string` - Access token for shop authentication.
  - `pageSize`: `number` - Number of products per page.
  - `offset`: `number` - Offset for pagination.
  - `status`: `ITEM_STATUS[]` - Status of the products.
  - `updateTimeFrom` (optional): `number` - Timestamp for filtering products updated from this time.
  - `updateTimeTo` (optional): `number` - Timestamp for filtering products updated to this time.

---
##### `getProductBaseInfo(shopId: number, accessToken: string, productIds: number[]): Promise<ShopeeApiResponseDto>`

Retrieves basic information for specified products in the shop.

- **Parameters:**
  - `shopId`: `number` - ID of the shop.
  - `accessToken`: `string` - Access token for shop authentication.
  - `productIds`: `number[]` - IDs of the products to retrieve information for.

---

##### `getProductExtraInfo(shopId: number, accessToken: string, productIds: number[]): Promise<ShopeeApiResponseDto>`

Retrieves additional information for specified products in the shop.

- **Parameters:**
  - `shopId`: `number` - ID of the shop.
  - `accessToken`: `string` - Access token for shop authentication.
  - `productIds`: `number[]` - IDs of the products to retrieve additional information for.

---

##### `getProductModels(shopId: number, accessToken: string, productId: number): Promise<ShopeeApiResponseDto>`

Retrieve models of a specific product in the shop.

- **Parameters:**
  - `shopId`: `number` - ID of the shop.
  - `accessToken`: `string` - Access token for shop authentication.
  - `productId`: `number` - ID of the product to retrieve models for.

---
##### `updateProductPrice(shopId: number, accessToken: string, productId: number, priceList: { model_id?: number; original_price: number }[]): Promise<ShopeeApiResponseDto>`

Updates the prices of product models in the shop.

- **Parameters:**
  - `shopId`: `number` - ID of the shop.
  - `accessToken`: `string` - Access token for shop authentication.
  - `productId`: `number` - ID of the product to update prices for.
  - `priceList`: `{ model_id?: number; original_price: number }[]` - List of model IDs and corresponding prices to be updated.

---

##### `updateProductStock(shopId: number, accessToken: string, productId: number, stockList: { model_id?: number; normal_stock: number }[]): Promise<ShopeeApiResponseDto>`

Updates the stock of product models in the shop.

- **Parameters:**
  - `shopId`: `number` - ID of the shop.
  - `accessToken`: `string` - Access token for shop authentication.
  - `productId`: `number` - ID of the product to update stock for.
  - `stockList`: `{ model_id?: number; normal_stock: number }[]` - List of model IDs and corresponding stock quantities to be updated.

---

##### `initProductTier(shopId: number, accessToken: string, productId: number, tierVariations: { name?: number; option_list: { option: string; image: { image_id: string } }[] }[], model: { tier_index: number[]; normal_stock: number; original_price: number; model_sku: string }[]): Promise<ShopeeApiResponseDto>`

Initializes product tier information with variations and models.

- **Parameters:**
  - `shopId`: `number` - ID of the shop.
  - `accessToken`: `string` - Access token for shop authentication.
  - `productId`: `number` - ID of the product to initialize tier information for.
  - `tierVariations`: `{ name?: number; option_list: { option: string; image: { image_id: string } }[] }[]` - List of tier variations with options and images.
  - `model`: `{ tier_index: number[]; normal_stock: number; original_price: number; model_sku: string }[]` - List of models with tier indices, stock, prices, and SKU.

---

##### `delistProduct(shopId: number, accessToken: string, productList: { item_id: number; unlist: boolean }[]): Promise<ShopeeApiResponseDto>`

Unlists or delists products from the shop.

- **Parameters:**
  - `shopId`: `number` - ID of the shop.
  - `accessToken`: `string` - Access token for shop authentication.
  - `productList`: `{ item_id: number; unlist: boolean }[]` - List of product IDs and unlist boolean values.

---

##### `getLogisticChannels(shopId: number, accessToken: string): Promise<any>`

Retrieves logistic channels available for the shop.

- **Parameters:**
  - `shopId`: `number` - ID of the shop.
  - `accessToken`: `string` - Access token for shop authentication.
  
---


### Confusion???

Follow the instructions from the [Shopee Open API Documentation](https://open.shopee.com/) for specific detail.

## Contribute

Contributions welcome! Read the [contribution guidelines](../../CONTRIBUTING.md) first.

## License

[MIT License](../../LICENSE)
