import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { policyApi } from "../api/apiClient";
import Alert from "../components/Alert";
import Loading from "../components/Loading";
import { Policy } from "../types";

const Policies = () => {
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPolicies = async () => {
      try {
        setLoading(true);
        const response = await policyApi.getAll();
        setPolicies(response.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching policies:", err);
        setError("Failed to load policies. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchPolicies();
  }, []);

  const handleDeletePolicy = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this policy?")) {
      try {
        await policyApi.delete(id);
        setPolicies(policies.filter((policy) => policy.id !== id));
      } catch (err) {
        console.error("Error deleting policy:", err);
        setError("Failed to delete policy. Please try again later.");
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
        <h1>Insurance Policies</h1>
        <Link to="/policies/create">
          <button>Create New Policy</button>
        </Link>
      </div>

      {error && <Alert type="error">{error}</Alert>}

      {policies.length === 0 ? (
        <p>No policies found. Create a new one to get started.</p>
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
                  <Link to={`/policies/edit/${policy.id}`}>
                    <button className="btn-edit">Edit</button>
                  </Link>
                  <button
                    className="btn-delete"
                    onClick={() => handleDeletePolicy(policy.id)}
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

export default Policies;
