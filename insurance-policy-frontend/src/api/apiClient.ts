import axios from "axios";
import {
  ApiResponse,
  Client,
  CreateClientRequest,
  CreatePolicyRequest,
  Policy,
  UpdateClientRequest,
  UpdatePolicyRequest,
} from "../types";

// Get API base URL from window.ENV or Vite environment or fallback to localhost
const getApiBaseUrl = () => {
  // Check if runtime environment config exists
  if (window.ENV && window.ENV.VITE_API_BASE_URL) {
    return window.ENV.VITE_API_BASE_URL;
  }
  // Fall back to build-time environment variable or default
  return import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";
};

// Create axios instance with default config
const api = axios.create({
  baseURL: getApiBaseUrl(),
  headers: {
    "Content-Type": "application/json",
  },
});

// Client API endpoints
export const clientApi = {
  getAll: async (): Promise<ApiResponse<Client[]>> => {
    const response = await api.get<ApiResponse<Client[]>>("/clients");
    return response.data;
  },

  getById: async (id: number): Promise<ApiResponse<Client>> => {
    const response = await api.get<ApiResponse<Client>>(`/clients/${id}`);
    return response.data;
  },

  create: async (client: CreateClientRequest): Promise<ApiResponse<Client>> => {
    const response = await api.post<ApiResponse<Client>>("/clients", client);
    return response.data;
  },

  update: async (client: UpdateClientRequest): Promise<ApiResponse<Client>> => {
    const response = await api.put<ApiResponse<Client>>(
      `/clients/${client.id}`,
      client
    );
    return response.data;
  },

  delete: async (id: number): Promise<ApiResponse<void>> => {
    const response = await api.delete<ApiResponse<void>>(`/clients/${id}`);
    return response.data;
  },
};

// Policy API endpoints
export const policyApi = {
  getAll: async (): Promise<ApiResponse<Policy[]>> => {
    const response = await api.get<ApiResponse<Policy[]>>("/policies");
    return response.data;
  },

  getById: async (id: number): Promise<ApiResponse<Policy>> => {
    const response = await api.get<ApiResponse<Policy>>(`/policies/${id}`);
    return response.data;
  },

  create: async (policy: CreatePolicyRequest): Promise<ApiResponse<Policy>> => {
    const response = await api.post<ApiResponse<Policy>>("/policies", policy);
    return response.data;
  },

  update: async (policy: UpdatePolicyRequest): Promise<ApiResponse<Policy>> => {
    const response = await api.put<ApiResponse<Policy>>(
      `/policies/${policy.id}`,
      policy
    );
    return response.data;
  },

  delete: async (id: number): Promise<ApiResponse<void>> => {
    const response = await api.delete<ApiResponse<void>>(`/policies/${id}`);
    return response.data;
  },

  getByClientId: async (clientId: number): Promise<ApiResponse<Policy[]>> => {
    const response = await api.get<ApiResponse<Policy[]>>(
      `/policies/client/${clientId}`
    );
    return response.data;
  },
};
