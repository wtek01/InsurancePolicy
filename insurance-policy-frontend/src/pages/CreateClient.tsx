import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { clientApi } from "../api/apiClient";
import Alert from "../components/Alert";
import ClientForm from "../components/ClientForm";
import { CreateClientRequest } from "../types";

const CreateClient = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (clientData: CreateClientRequest) => {
    try {
      setLoading(true);
      const response = await clientApi.create(clientData);
      navigate(`/clients/${response.data.id}`);
    } catch (err) {
      console.error("Error creating client:", err);
      setError("Failed to create client. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Create New Client</h1>
      {error && <Alert type="error">{error}</Alert>}
      <div className="card">
        <ClientForm onSubmit={handleSubmit} isLoading={loading} />
      </div>
    </div>
  );
};

export default CreateClient;
