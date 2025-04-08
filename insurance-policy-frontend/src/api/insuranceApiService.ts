import axios from "axios";
import {
  DEFAULT_PAGE,
  DEFAULT_PAGE_SIZE,
  DEFAULT_SORT_DIRECTION,
  DEFAULT_SORT_FIELD,
} from "../constants/paginationConfig";
import {
  ApiResponse,
  CreatePolicyRequest,
  PagedResponse,
  Policy,
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
const apiInstance = axios.create({
  baseURL: getApiBaseUrl(),
  headers: {
    "Content-Type": "application/json",
  },
});

// Policy API endpoints
export const policyApi = {
  getAll: async (): Promise<ApiResponse<Policy[]>> => {
    const response = await apiInstance.get<ApiResponse<Policy[]>>("/policies");
    return response.data;
  },

  getPaginated: async (
    page: number = DEFAULT_PAGE,
    size: number = DEFAULT_PAGE_SIZE,
    sort: string = DEFAULT_SORT_FIELD,
    direction: string = DEFAULT_SORT_DIRECTION
  ): Promise<PagedResponse<Policy>> => {
    const response = await apiInstance.get<PagedResponse<Policy>>(
      "/policies/paged",
      {
        params: { page, size, sort, direction },
      }
    );
    return response.data;
  },

  getById: async (id: number): Promise<ApiResponse<Policy>> => {
    const response = await apiInstance.get<ApiResponse<Policy>>(
      `/policies/${id}`
    );
    return response.data;
  },

  create: async (policy: CreatePolicyRequest): Promise<ApiResponse<Policy>> => {
    const response = await apiInstance.post<ApiResponse<Policy>>(
      "/policies",
      policy
    );
    return response.data;
  },

  update: async (policy: UpdatePolicyRequest): Promise<ApiResponse<Policy>> => {
    const response = await apiInstance.put<ApiResponse<Policy>>(
      `/policies/${policy.id}`,
      policy
    );
    return response.data;
  },

  delete: async (id: number): Promise<ApiResponse<void>> => {
    const response = await apiInstance.delete<ApiResponse<void>>(
      `/policies/${id}`
    );
    return response.data;
  },
};
