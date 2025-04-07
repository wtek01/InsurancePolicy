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
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
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
            required
          />
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
            required
          />
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
