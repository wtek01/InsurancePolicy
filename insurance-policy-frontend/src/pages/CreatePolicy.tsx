import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { policyApi } from "../api/apiClient";
import Alert from "../components/Alert";
import PolicyForm from "../components/PolicyForm";
import { CreatePolicyRequest } from "../types";

const CreatePolicy = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preSelectedClientId, setPreSelectedClientId] = useState<
    number | undefined
  >(undefined);

  useEffect(() => {
    // Check if we have a clientId from the query params
    const searchParams = new URLSearchParams(location.search);
    const clientId = searchParams.get("clientId");

    if (clientId) {
      setPreSelectedClientId(Number(clientId));
    }
  }, [location]);

  const handleSubmit = async (policyData: CreatePolicyRequest) => {
    try {
      setLoading(true);
      const response = await policyApi.create(policyData);
      navigate(`/policies/${response.data.id}`);
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
        <PolicyForm
          onSubmit={handleSubmit}
          isLoading={loading}
          preSelectedClientId={preSelectedClientId}
        />
      </div>
    </div>
  );
};

export default CreatePolicy;
