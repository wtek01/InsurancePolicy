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
  policyNumber: string;
  type: PolicyType;
  startDate: string;
  endDate: string;
  premium: number;
  coverageAmount: number;
  status: PolicyStatus;
  clientId: number;
  client?: Client;
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
  policyNumber: string;
  type: PolicyType;
  startDate: string;
  endDate: string;
  premium: number;
  coverageAmount: number;
  status: PolicyStatus;
  clientId: number;
}

export interface UpdatePolicyRequest extends CreatePolicyRequest {
  id: number;
}

export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}
