export const createProductValidation = (
  body: any
) => {

  const errors: string[] = [];

  if (!body.name)
    errors.push(
      "name is required"
    );

  if (!body.basePrice)
    errors.push(
      "basePrice is required"
    );

  if (!body.description)
    errors.push(
      "description is required"
    );

  if (!body.categoryId)
    errors.push(
      "categoryId is required"
    );

  if (
    body.basePrice &&
    body.basePrice < 0
  ) {
    errors.push(
      "basePrice must be positive"
    );
  }

  return errors;
};