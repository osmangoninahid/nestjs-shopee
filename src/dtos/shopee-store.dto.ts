export interface ShopeeStore {
    shop_name: string;
    region: string;
    status: string;
    sip_affi_shops: { affi_shop_id: number; region: string }[];
    is_cb: boolean;
    is_cnsc: boolean;
    request_id: string;
    auth_time: number;
    expire_time: number;
}
