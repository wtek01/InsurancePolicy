import { FormEvent, useEffect, useState } from "react";
import { CreatePolicyRequest, Policy, PolicyStatus } from "../types";

interface PolicyFormProps {
  policy?: Policy;
  onSubmit: (policy: CreatePolicyRequest) => void;
  isLoading: boolean;
}

const PolicyForm = ({ policy, onSubmit, isLoading }: PolicyFormProps) => {
  const [formData, setFormData] = useState<CreatePolicyRequest>({
    policyName: "",
    status: PolicyStatus.ACTIVE,
    coverageStartDate: "",
    coverageEndDate: "",
  });
  const [validationErrors, setValidationErrors] = useState<{
    coverageStartDate?: string;
    coverageEndDate?: string;
  }>({});

  useEffect(() => {
    if (policy) {
      setFormData({
        policyName: policy.policyName,
        status: policy.status,
        coverageStartDate: policy.coverageStartDate.split("T")[0], // Extract date part
        coverageEndDate: policy.coverageEndDate.split("T")[0], // Extract date part
      });
    }
  }, [policy]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear validation errors when user changes input
    if (validationErrors[name as keyof typeof validationErrors]) {
      setValidationErrors({
        ...validationErrors,
        [name]: undefined,
      });
    }
  };

  const validateDates = (): boolean => {
    const errors: {
      coverageStartDate?: string;
      coverageEndDate?: string;
    } = {};
    let isValid = true;

    // Get current date (normalized to midnight for comparison)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Parse the dates for validation
    const startDate = formData.coverageStartDate
      ? new Date(formData.coverageStartDate)
      : null;
    const endDate = formData.coverageEndDate
      ? new Date(formData.coverageEndDate)
      : null;

    // Validate start date is not in the past
    if (startDate && startDate < today) {
      errors.coverageStartDate = "Start date cannot be in the past";
      isValid = false;
    }

    // Validate end date is after start date
    if (startDate && endDate && endDate < startDate) {
      errors.coverageEndDate = "End date must be after start date";
      isValid = false;
    }

    setValidationErrors(errors);
    return isValid;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    // Validate dates before submitting
    if (validateDates()) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label className="form-label" htmlFor="policyName">
          Policy Name
        </label>
        <input
          type="text"
          id="policyName"
          name="policyName"
          value={formData.policyName}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="status">
          Status
        </label>
        <select
          id="status"
          name="status"
          value={formData.status}
          onChange={handleChange}
          required
        >
          {Object.values(PolicyStatus).map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </div>

      <div className="form-row">
        <div className="form-group" style={{ flex: 1 }}>
          <label className="form-label" htmlFor="coverageStartDate">
            Start Date
          </label>
          <input
            type="date"
            id="coverageStartDate"
            name="coverageStartDate"
            value={formData.coverageStartDate}
            onChange={handleChange}
            min={new Date().toISOString().split("T")[0]} // Set min to today
            required
          />
          {validationErrors.coverageStartDate && (
            <div className="error-message">
              {validationErrors.coverageStartDate}
            </div>
          )}
        </div>
        <div className="form-group" style={{ flex: 1 }}>
          <label className="form-label" htmlFor="coverageEndDate">
            End Date
          </label>
          <input
            type="date"
            id="coverageEndDate"
            name="coverageEndDate"
            value={formData.coverageEndDate}
            onChange={handleChange}
            min={
              formData.coverageStartDate ||
              new Date().toISOString().split("T")[0]
            } // Set min to start date or today
            required
          />
          {validationErrors.coverageEndDate && (
            <div className="error-message">
              {validationErrors.coverageEndDate}
            </div>
          )}
        </div>
      </div>

      <div className="form-buttons">
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : policy ? "Update Policy" : "Create Policy"}
        </button>
      </div>
    </form>
  );
};

export default PolicyForm;
