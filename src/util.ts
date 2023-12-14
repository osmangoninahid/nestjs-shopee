import * as crypto from 'crypto';
import * as queryString from 'query-string';

/**
 * Generates a cryptographic signature using HMAC-SHA256 algorithm based on the provided partner key and parameters.
 * @param {string} partnerKey - The partner key used for generating the signature.
 * @param {string[]} params - List of parameters used in generating the signature.
 * @returns {string} The generated cryptographic signature.
 */
export const generateSign = (partnerKey: string, ...params) => {
  const baseString = params.reduce((prev, curr) => (prev += curr), '');
  return crypto
    .createHmac('sha256', partnerKey)
    .update(baseString)
    .digest('hex');
};

/**
 * Generates query parameters for API requests including partner ID, timestamp, signature, access token, and shop ID.
 * @param {string} apiPath - The API path to be used for the query.
 * @param {string} partnerId - The partner ID used in the query.
 * @param {string} partnerKey - The partner key used for generating the signature.
 * @param {string | undefined} accessToken - The access token (optional).
 * @param {number | undefined} shopId - The shop ID (optional).
 * @returns {string} The generated query parameters string.
 */
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
