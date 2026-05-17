export const createProductValidation = (body: any) => {
  const errors: string[] = [];

  if (!body.name) errors.push("name is required");
  if (!body.price) errors.push("price is required");
  if (!body.stock) errors.push("stock is required");
  if (!body.categoryId) errors.push("categoryId is required");

  if (body.price && body.price < 0)
    errors.push("price must be positive");

  if (body.stock && body.stock < 0)
    errors.push("stock must be positive");

  return errors;
};