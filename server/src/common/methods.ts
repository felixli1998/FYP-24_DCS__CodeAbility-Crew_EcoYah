import { Response } from 'express';
// Common methods
// -----------------------------------------------------------------------
type PayloadT = {
  [key: string]: any;
};

export const strongParams = (payload: PayloadT, allowedParams: string[]): Partial<PayloadT> => {
  const filteredParams: Partial<PayloadT> = {};

  for (const param of allowedParams) {
    if (payload[param] !== undefined) {
      filteredParams[param as string] = payload[param];
    }
  }

  return filteredParams;
}
// https://stackoverflow.com/questions/12806386/is-there-any-standard-for-json-api-response-format
export const generateResponse = (res: Response, status: number, data: any) => {
  return res.status(status).json({
    "status": status,
    "data": data,
  });
}