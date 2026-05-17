import {
  SaleStockBody,
  TransferStockBody,
} from "./stocks.types.js";

export const transferStockValidation = (
  body: TransferStockBody
) => {

  const errors: string[] = [];

  if (!body.toUserId) {
    errors.push(
      "toUserId is required"
    );
  }

  if (!body.productId) {
    errors.push(
      "productId is required"
    );
  }

  if (!body.qty) {
    errors.push(
      "qty is required"
    );
  }

  if (body.qty <= 0) {
    errors.push(
      "qty must be greater than 0"
    );
  }

  return errors;
};

export const saleStockValidation = (
  body: SaleStockBody
) => {

  const errors: string[] = [];

  if (!body.productId) {
    errors.push(
      "productId is required"
    );
  }

  if (!body.qty) {
    errors.push(
      "qty is required"
    );
  }

  if (!body.salePrice) {
    errors.push(
      "salePrice is required"
    );
  }

  if (body.qty <= 0) {
    errors.push(
      "qty must be greater than 0"
    );
  }

  if (body.salePrice <= 0) {
    errors.push(
      "salePrice must be greater than 0"
    );
  }

  return errors;
};