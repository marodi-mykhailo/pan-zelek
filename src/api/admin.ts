// API client for admin

const API_URL = import.meta.env.VITE_API_URL || '/api';

function getAuthHeaders() {
  const token = localStorage.getItem('authToken');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
}

export interface AdminStats {
  totalOrders: number;
  totalProducts: number;
  totalUsers: number;
  totalRevenue: number;
}

export async function getAdminStats(): Promise<AdminStats> {
  const response = await fetch(`${API_URL}/admin/stats`, {
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch admin stats');
  }

  return response.json();
}

export interface Order {
  id: string;
  email: string;
  phone?: string;
  status: string;
  total: number;
  shippingCost: number;
  paymentStatus: string;
  createdAt: string;
  items: Array<{
    product: {
      namePl: string;
    };
    weight: number;
    quantity: number;
    price: number;
  }>;
  shippingAddress: {
    street: string;
    city: string;
    postalCode: string;
  };
  user?: {
    id: string;
    name?: string;
    email: string;
  };
}

export async function getAdminOrders(): Promise<{ orders: Order[] }> {
  const response = await fetch(`${API_URL}/admin/orders`, {
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch orders');
  }

  return response.json();
}

export async function updateOrderStatus(
  orderId: string,
  status: string
): Promise<{ success: boolean; order: Order }> {
  const response = await fetch(`${API_URL}/admin/orders/${orderId}/status`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify({ status }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to update order status');
  }

  return response.json();
}
