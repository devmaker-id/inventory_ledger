export interface ProductQuery {
  page?: string;

  limit?: string;

  search?: string;

  categoryId?: string;
}

export interface CreateProductBody {
  name: string;

  description?: string;

  basePrice: number;

  categoryId: number;
}

export interface UpdateProductBody {
  name?: string;

  description?: string;

  basePrice?: number;

  categoryId?: number;

  image?: string;
}