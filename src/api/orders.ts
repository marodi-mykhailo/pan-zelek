// API client for orders

export interface OrderItem {
  productId: string;
  weight: number;
  quantity: number;
}

export interface CreateOrderData {
  items: OrderItem[];
  email: string;
  phone: string;
  name: string;
  street: string;
  city: string;
  postalCode: string;
  paymentMethod: string;
  userId?: string;
  sessionId?: string;
}

function getAuthHeaders() {
  const token = localStorage.getItem('authToken');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
}

const API_URL = import.meta.env.VITE_API_URL || '/api';

export async function createOrder(data: CreateOrderData) {
  const response = await fetch(`${API_URL}/orders`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create order');
  }

  return response.json();
}

export async function getOrder(orderId: string) {
  const response = await fetch(`${API_URL}/orders/${orderId}`, {
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch order');
  }

  return response.json();
}

export async function getUserOrders(): Promise<{ orders: any[] }> {
  const response = await fetch(`${API_URL}/orders`, {
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch orders');
  }

  return response.json();
}
