// API client for box templates

export interface BoxTemplateItem {
  productId: string;
  weight: number;
}

export interface BoxTemplate {
  id: string;
  name: string;
  totalWeight: number;
  items: Array<{
    id: string;
    productId: string;
    weight: number;
    product: {
      id: string;
      namePl: string;
      image?: string;
      pricePer100g: number;
    };
  }>;
  createdAt: string;
}

const API_URL = import.meta.env.VITE_API_URL || '/api';

function getAuthHeaders() {
  const token = localStorage.getItem('authToken');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
}

export async function getBoxTemplates(): Promise<{ templates: BoxTemplate[] }> {
  const response = await fetch(`${API_URL}/box-templates`, {
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch box templates');
  }

  return response.json();
}

export async function saveBoxTemplate(
  name: string,
  items: BoxTemplateItem[]
): Promise<{ success: boolean; template: BoxTemplate }> {
  const response = await fetch(`${API_URL}/box-templates`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ name, items }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to save box template');
  }

  return response.json();
}

export async function deleteBoxTemplate(templateId: string): Promise<void> {
  const response = await fetch(`${API_URL}/box-templates/${templateId}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error('Failed to delete box template');
  }
}
