// API client for authentication

export interface RegisterData {
  email: string;
  password: string;
  name?: string;
  phone?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  user: {
    id: string;
    email: string;
    name?: string;
    phone?: string;
    role?: 'USER' | 'ADMIN';
  };
  token: string;
}

const API_URL = import.meta.env.VITE_API_URL || '/api';

export async function register(data: RegisterData): Promise<AuthResponse> {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to register');
  }

  return response.json();
}

export async function login(data: LoginData): Promise<AuthResponse> {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to login');
  }

  return response.json();
}

export async function getCurrentUser(): Promise<{ user: AuthResponse['user'] }> {
  const token = localStorage.getItem('authToken');

  if (!token) {
    throw new Error('Not authenticated');
  }

  const response = await fetch(`${API_URL}/auth/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch user');
  }

  return response.json();
}
