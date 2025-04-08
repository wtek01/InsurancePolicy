export interface Policy {
  id: number;
  policyName: string;
  status: PolicyStatus;
  coverageStartDate: string;
  coverageEndDate: string;
  createdAt: string;
  updatedAt: string;
}

export enum PolicyStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
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
