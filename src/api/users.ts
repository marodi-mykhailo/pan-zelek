// API client for users (admin)

const API_URL = import.meta.env.VITE_API_URL || '/api';

function getAuthHeaders() {
  const token = localStorage.getItem('authToken');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
}

export interface User {
  id: string;
  email: string;
  name?: string;
  phone?: string;
  createdAt: string;
}

export async function getUsers(): Promise<{ users: User[] }> {
  const response = await fetch(`${API_URL}/users`, {
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch users');
  }

  return response.json();
}
