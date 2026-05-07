import { PageableParams } from "../common";

export interface ProductUserResponse {
  id: number;

  firstName: string;
  lastName: string;

  username: string;
}

export interface ProductCategoryResponse {
  id: number;

  name: string;
}

export interface ProductResponse {
  id: number;

  name: string;
  description: string;

  imageUrl: string;

  active: boolean;

  unitPrice: number;

  user: ProductUserResponse;

  category: ProductCategoryResponse;

  createdAt: string;
  updatedAt: string;
}

export interface GetProductsParams extends PageableParams {
  name?: string;

  active?: boolean;

  minPrice?: number;
  maxPrice?: number;

  categoryId?: number;

  minDate?: string;
  maxDate?: string;
}

export interface CreateProductRequest {
  name: string;

  description?: string;

  unitPrice: number;

  categoryId: number;
}

export interface UpdateProductRequest {
  name: string;

  description?: string;

  unitPrice: number;

  categoryId: number;

  active: boolean;
}