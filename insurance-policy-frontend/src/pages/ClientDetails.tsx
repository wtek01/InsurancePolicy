import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { clientApi, policyApi } from "../api/apiClient";
import Alert from "../components/Alert";
import Loading from "../components/Loading";
import { Client, Policy } from "../types";

const ClientDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [client, setClient] = useState<Client | null>(null);
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;

      try {
        setLoading(true);
        // Fetch client details
        const clientResponse = await clientApi.getById(Number(id));
        setClient(clientResponse.data);

        // Fetch associated policies
        const policiesResponse = await policyApi.getByClientId(Number(id));
        setPolicies(policiesResponse.data);

        setError(null);
      } catch (err) {
        console.error("Error fetching client details:", err);
        setError("Failed to load client details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleDeleteClient = async () => {
    if (!client) return;

    if (
      window.confirm(
        "Are you sure you want to delete this client? This will also delete all associated policies."
      )
    ) {
      try {
        await clientApi.delete(client.id);
        navigate("/clients");
      } catch (err) {
        console.error("Error deleting client:", err);
        setError("Failed to delete client. Please try again later.");
      }
    }
  };

  if (loading) return <Loading />;
  if (error) return <Alert type="error">{error}</Alert>;
  if (!client) return <Alert type="error">Client not found.</Alert>;

  return (
    <div>
      <div
        className="form-row"
        style={{ justifyContent: "space-between", alignItems: "center" }}
      >
        <h1>Client Details</h1>
        <div className="action-buttons">
          <Link to="/clients">
            <button>Back to Clients</button>
          </Link>
          <Link to={`/clients/edit/${client.id}`}>
            <button className="btn-edit">Edit Client</button>
          </Link>
          <button className="btn-delete" onClick={handleDeleteClient}>
            Delete Client
          </button>
        </div>
      </div>

      <div className="card">
        <h2>Client Information</h2>
        <div className="form-row">
          <div style={{ flex: 1 }}>
            <p>
              <strong>Name:</strong> {`${client.firstName} ${client.lastName}`}
            </p>
            <p>
              <strong>Email:</strong> {client.email}
            </p>
            <p>
              <strong>Phone:</strong> {client.phoneNumber}
            </p>
          </div>
          <div style={{ flex: 1 }}>
            <p>
              <strong>Address:</strong> {client.address}
            </p>
            <p>
              <strong>Date of Birth:</strong>{" "}
              {new Date(client.dateOfBirth).toLocaleDateString()}
            </p>
            <p>
              <strong>Created:</strong>{" "}
              {new Date(client.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      <div className="card">
        <div
          className="form-row"
          style={{ justifyContent: "space-between", alignItems: "center" }}
        >
          <h2>Client Policies</h2>
          <Link to={`/policies/create?clientId=${client.id}`}>
            <button>Create New Policy</button>
          </Link>
        </div>

        {policies.length === 0 ? (
          <p>No policies found for this client.</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Policy Number</th>
                <th>Type</th>
                <th>Status</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Premium</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {policies.map((policy) => (
                <tr key={policy.id}>
                  <td>{policy.policyNumber}</td>
                  <td>{policy.type}</td>
                  <td>{policy.status}</td>
                  <td>{new Date(policy.startDate).toLocaleDateString()}</td>
                  <td>{new Date(policy.endDate).toLocaleDateString()}</td>
                  <td>${policy.premium.toFixed(2)}</td>
                  <td className="action-buttons">
                    <Link to={`/policies/${policy.id}`}>
                      <button>View</button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ClientDetails;
