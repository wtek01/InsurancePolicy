import { FormEvent, useEffect, useState } from "react";
import { clientApi } from "../api/apiClient";
import {
  Client,
  CreatePolicyRequest,
  Policy,
  PolicyStatus,
  PolicyType,
} from "../types";

interface PolicyFormProps {
  policy?: Policy;
  onSubmit: (policy: CreatePolicyRequest) => void;
  isLoading: boolean;
  preSelectedClientId?: number;
}

const PolicyForm = ({
  policy,
  onSubmit,
  isLoading,
  preSelectedClientId,
}: PolicyFormProps) => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loadingClients, setLoadingClients] = useState(false);
  const [formData, setFormData] = useState<CreatePolicyRequest>({
    policyNumber: "",
    type: PolicyType.HEALTH,
    startDate: "",
    endDate: "",
    premium: 0,
    coverageAmount: 0,
    status: PolicyStatus.PENDING,
    clientId: preSelectedClientId || 0,
  });

  useEffect(() => {
    const fetchClients = async () => {
      try {
        setLoadingClients(true);
        const response = await clientApi.getAll();
        setClients(response.data);
      } catch (error) {
        console.error("Error fetching clients:", error);
      } finally {
        setLoadingClients(false);
      }
    };

    fetchClients();
  }, []);

  useEffect(() => {
    if (policy) {
      setFormData({
        policyNumber: policy.policyNumber,
        type: policy.type,
        startDate: policy.startDate.split("T")[0], // Extract date part
        endDate: policy.endDate.split("T")[0], // Extract date part
        premium: policy.premium,
        coverageAmount: policy.coverageAmount,
        status: policy.status,
        clientId: policy.clientId,
      });
    }
  }, [policy]);

  useEffect(() => {
    if (preSelectedClientId) {
      setFormData((prev) => ({ ...prev, clientId: preSelectedClientId }));
    }
  }, [preSelectedClientId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]:
        name === "premium" || name === "coverageAmount" || name === "clientId"
          ? parseFloat(value)
          : value,
    });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label className="form-label" htmlFor="policyNumber">
          Policy Number
        </label>
        <input
          type="text"
          id="policyNumber"
          name="policyNumber"
          value={formData.policyNumber}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-row">
        <div className="form-group" style={{ flex: 1 }}>
          <label className="form-label" htmlFor="type">
            Policy Type
          </label>
          <select
            id="type"
            name="type"
            value={formData.type}
            onChange={handleChange}
            required
          >
            {Object.values(PolicyType).map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group" style={{ flex: 1 }}>
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
      </div>

      <div className="form-row">
        <div className="form-group" style={{ flex: 1 }}>
          <label className="form-label" htmlFor="startDate">
            Start Date
          </label>
          <input
            type="date"
            id="startDate"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group" style={{ flex: 1 }}>
          <label className="form-label" htmlFor="endDate">
            End Date
          </label>
          <input
            type="date"
            id="endDate"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group" style={{ flex: 1 }}>
          <label className="form-label" htmlFor="premium">
            Premium ($)
          </label>
          <input
            type="number"
            id="premium"
            name="premium"
            value={formData.premium}
            onChange={handleChange}
            min="0"
            step="0.01"
            required
          />
        </div>
        <div className="form-group" style={{ flex: 1 }}>
          <label className="form-label" htmlFor="coverageAmount">
            Coverage Amount ($)
          </label>
          <input
            type="number"
            id="coverageAmount"
            name="coverageAmount"
            value={formData.coverageAmount}
            onChange={handleChange}
            min="0"
            step="0.01"
            required
          />
        </div>
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="clientId">
          Client
        </label>
        <select
          id="clientId"
          name="clientId"
          value={formData.clientId}
          onChange={handleChange}
          required
          disabled={!!preSelectedClientId || loadingClients}
        >
          <option value="">Select a client</option>
          {clients.map((client) => (
            <option key={client.id} value={client.id}>
              {`${client.firstName} ${client.lastName} (${client.email})`}
            </option>
          ))}
        </select>
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
