// API client for products

export interface Product {
  id: string;
  name: string;
  namePl: string;
  description?: string;
  descriptionPl?: string;
  image?: string;
  category: string;
  pricePer100g: number;
  inStock: boolean;
  stockWeight?: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProductsResponse {
  products: Product[];
}

export interface ProductResponse {
  product: Product;
}

const API_URL = import.meta.env.VITE_API_URL || '/api';

export async function getProducts(filters?: {
  category?: string;
  inStock?: boolean;
  search?: string;
}): Promise<Product[]> {
  const params = new URLSearchParams();

  if (filters?.category) {
    params.append('category', filters.category);
  }

  if (filters?.inStock !== undefined) {
    params.append('inStock', String(filters.inStock));
  }

  if (filters?.search) {
    params.append('search', filters.search);
  }

  const url = `${API_URL}/products${params.toString() ? `?${params.toString()}` : ''}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error('Failed to fetch products');
  }

  const data: ProductsResponse = await response.json();
  return data.products;
}

export async function getProduct(id: string): Promise<Product> {
  const response = await fetch(`${API_URL}/products/${id}`);

  if (!response.ok) {
    throw new Error('Failed to fetch product');
  }

  const data: ProductResponse = await response.json();
  return data.product;
}

function getAuthHeaders() {
  const token = localStorage.getItem('authToken');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
}

export interface CreateProductData {
  name: string;
  namePl: string;
  description?: string;
  descriptionPl?: string;
  category: string;
  pricePer100g: number;
  inStock?: boolean;
  stockWeight?: number;
  image?: string;
}

export async function createProduct(data: CreateProductData): Promise<{ success: boolean; product: Product }> {
  const response = await fetch(`${API_URL}/products`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create product');
  }

  return response.json();
}

export async function updateProduct(
  id: string,
  data: Partial<CreateProductData>
): Promise<{ success: boolean; product: Product }> {
  const response = await fetch(`${API_URL}/products/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to update product');
  }

  return response.json();
}

export async function deleteProduct(id: string): Promise<void> {
  const response = await fetch(`${API_URL}/products/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error('Failed to delete product');
  }
}
