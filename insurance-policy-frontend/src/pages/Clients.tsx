import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { clientApi } from "../api/apiClient";
import Alert from "../components/Alert";
import Loading from "../components/Loading";
import { Client } from "../types";

const Clients = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        setLoading(true);
        const response = await clientApi.getAll();
        setClients(response.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching clients:", err);
        setError("Failed to load clients. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, []);

  const handleDeleteClient = async (id: number) => {
    if (
      window.confirm(
        "Are you sure you want to delete this client? This will also delete all associated policies."
      )
    ) {
      try {
        await clientApi.delete(id);
        setClients(clients.filter((client) => client.id !== id));
      } catch (err) {
        console.error("Error deleting client:", err);
        setError("Failed to delete client. Please try again later.");
      }
    }
  };

  if (loading) return <Loading />;

  return (
    <div>
      <div
        className="form-row"
        style={{ justifyContent: "space-between", alignItems: "center" }}
      >
        <h1>Clients</h1>
        <Link to="/clients/create">
          <button>Create New Client</button>
        </Link>
      </div>

      {error && <Alert type="error">{error}</Alert>}

      {clients.length === 0 ? (
        <p>No clients found. Create a new one to get started.</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Address</th>
              <th>Date of Birth</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {clients.map((client) => (
              <tr key={client.id}>
                <td>{`${client.firstName} ${client.lastName}`}</td>
                <td>{client.email}</td>
                <td>{client.phoneNumber}</td>
                <td>{client.address}</td>
                <td>{new Date(client.dateOfBirth).toLocaleDateString()}</td>
                <td className="action-buttons">
                  <Link to={`/clients/${client.id}`}>
                    <button>View</button>
                  </Link>
                  <Link to={`/clients/edit/${client.id}`}>
                    <button className="btn-edit">Edit</button>
                  </Link>
                  <button
                    className="btn-delete"
                    onClick={() => handleDeleteClient(client.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Clients;
