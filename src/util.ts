import * as crypto from 'crypto';
import * as queryString from 'query-string';

export const generateSign = (partnerKey: string, ...params) => {
  const baseString = params.reduce((prev, curr) => (prev += curr), '');
  return crypto
    .createHmac('sha256', partnerKey)
    .update(baseString)
    .digest('hex');
};

export const generateQueryParams = (
  apiPath: string,
  partnerId: string,
  partnerKey: string,
  accessToken?: string,
  shopId?: number,
): string => {
  const timeStamp = Math.round(new Date().getTime() / 1000);
  const sign = generateSign(
    partnerKey,
    partnerId,
    apiPath,
    timeStamp,
    accessToken || '',
    shopId || '',
  );

  return `${apiPath}?${queryString.stringify({
    partner_id: partnerId,
    timestamp: timeStamp,
    sign,
    access_token: accessToken,
    shop_id: shopId,
  })}`;
};
