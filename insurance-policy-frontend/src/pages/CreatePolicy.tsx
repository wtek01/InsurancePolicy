import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { policyApi } from "../api/apiClient";
import Alert from "../components/Alert";
import PolicyForm from "../components/PolicyForm";
import { CreatePolicyRequest, Policy } from "../types";

const CreatePolicy = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Type guard to check if an object is a Policy
  const isPolicyObject = (obj: unknown): obj is Policy => {
    return !!(obj && typeof obj === "object" && obj !== null && "id" in obj);
  };

  const handleSubmit = async (policyData: CreatePolicyRequest) => {
    try {
      setLoading(true);
      const response = await policyApi.create(policyData);
      console.log("API Response for create policy:", response);

      // Handle the response properly
      let policyId: number | undefined;

      if (response) {
        if ("data" in response && response.data && "id" in response.data) {
          policyId = response.data.id;
        } else if (isPolicyObject(response)) {
          policyId = response.id;
        }
      }

      if (policyId) {
        navigate(`/policies/${policyId}`);
      } else {
        console.error("Invalid response after creating policy:", response);
        setError("Failed to create policy. Unexpected response from server.");
      }
    } catch (err) {
      console.error("Error creating policy:", err);
      setError("Failed to create policy. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Create New Policy</h1>
      {error && <Alert type="error">{error}</Alert>}
      <div className="card">
        <PolicyForm onSubmit={handleSubmit} isLoading={loading} />
      </div>
    </div>
  );
};

export default CreatePolicy;
