export interface Client {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  address: string;
  dateOfBirth: string;
  createdAt: string;
  updatedAt: string;
}

export interface Policy {
  id: number;
  policyName: string;
  status: PolicyStatus;
  coverageStartDate: string;
  coverageEndDate: string;
  createdAt: string;
  updatedAt: string;
}

export enum PolicyType {
  HEALTH = "HEALTH",
  LIFE = "LIFE",
  AUTO = "AUTO",
  HOME = "HOME",
  TRAVEL = "TRAVEL",
}

export enum PolicyStatus {
  ACTIVE = "ACTIVE",
  EXPIRED = "EXPIRED",
  CANCELLED = "CANCELLED",
  PENDING = "PENDING",
  INACTIVE = "INACTIVE",
}

export interface CreateClientRequest {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  address: string;
  dateOfBirth: string;
}

export interface UpdateClientRequest extends CreateClientRequest {
  id: number;
}

export interface CreatePolicyRequest {
  policyName: string;
  status: PolicyStatus;
  coverageStartDate: string;
  coverageEndDate: string;
}

export interface UpdatePolicyRequest extends CreatePolicyRequest {
  id: number;
}

export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

export interface PagedResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}
