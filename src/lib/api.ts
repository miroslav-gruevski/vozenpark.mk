import type { Vehicle, VehicleFormData } from '@/types';

const API_BASE = '/api';

// Minimal form data for create/update (only required fields)
type VehicleFormInput = Partial<VehicleFormData> & {
  plate: string;
  regExpiry: string;
  insExpiry: string;
  inspExpiry: string;
};

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Something went wrong' }));
    throw new Error(error.message || 'Something went wrong');
  }
  return response.json();
}

// Auth
export async function login(email: string, password: string): Promise<{ success: boolean }> {
  const response = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  return handleResponse(response);
}

export async function signup(
  email: string,
  password: string,
  language: string
): Promise<{ success: boolean }> {
  const response = await fetch(`${API_BASE}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, language }),
  });
  return handleResponse(response);
}

export async function logout(): Promise<{ success: boolean }> {
  const response = await fetch(`${API_BASE}/auth/logout`, {
    method: 'POST',
  });
  return handleResponse(response);
}

// Vehicles
export async function getVehicles(): Promise<Vehicle[]> {
  const response = await fetch(`${API_BASE}/vehicles`);
  return handleResponse(response);
}

export async function getVehicle(id: string): Promise<Vehicle> {
  const response = await fetch(`${API_BASE}/vehicles/${id}`);
  return handleResponse(response);
}

export async function createVehicle(data: VehicleFormInput): Promise<Vehicle> {
  const response = await fetch(`${API_BASE}/vehicles`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return handleResponse(response);
}

export async function updateVehicle(id: string, data: VehicleFormInput): Promise<Vehicle> {
  const response = await fetch(`${API_BASE}/vehicles/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return handleResponse(response);
}

export async function deleteVehicle(id: string): Promise<{ success: boolean }> {
  const response = await fetch(`${API_BASE}/vehicles/${id}`, {
    method: 'DELETE',
  });
  return handleResponse(response);
}

// User
export async function updateLanguage(language: string): Promise<{ success: boolean }> {
  const response = await fetch(`${API_BASE}/user/language`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ language }),
  });
  return handleResponse(response);
}
