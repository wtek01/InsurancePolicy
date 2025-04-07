import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { clientApi } from "../api/apiClient";
import Alert from "../components/Alert";
import ClientForm from "../components/ClientForm";
import Loading from "../components/Loading";
import { Client, CreateClientRequest } from "../types";

const EditClient = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchClient = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const response = await clientApi.getById(Number(id));
        setClient(response.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching client:", err);
        setError("Failed to load client data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchClient();
  }, [id]);

  const handleSubmit = async (clientData: CreateClientRequest) => {
    if (!client) return;

    try {
      setSaving(true);
      // Combine client ID with form data
      const updateData = {
        ...clientData,
        id: client.id,
      };

      await clientApi.update(updateData);
      navigate(`/clients/${client.id}`);
    } catch (err) {
      console.error("Error updating client:", err);
      setError("Failed to update client. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loading />;
  if (error && !client) return <Alert type="error">{error}</Alert>;
  if (!client) return <Alert type="error">Client not found.</Alert>;

  return (
    <div>
      <h1>Edit Client</h1>
      {error && <Alert type="error">{error}</Alert>}
      <div className="card">
        <ClientForm
          client={client}
          onSubmit={handleSubmit}
          isLoading={saving}
        />
      </div>
    </div>
  );
};

export default EditClient;
