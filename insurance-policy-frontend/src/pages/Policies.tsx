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

  // Helper function to check if an object is a Policy
  const isPolicy = (item: unknown): item is Policy => {
    return (
      typeof item === "object" &&
      item !== null &&
      "id" in item &&
      "policyName" in item &&
      "status" in item
    );
  };

  // Helper function to check if an array contains Policy objects
  const isPolicyArray = (items: unknown[]): items is Policy[] => {
    return items.length === 0 || isPolicy(items[0]);
  };

  useEffect(() => {
    const fetchPolicies = async () => {
      try {
        setLoading(true);
        const response = await policyApi.getAll();
        console.log("API Response:", response);

        // Initialize empty policies array
        let policiesData: Policy[] = [];

        // Handle different response formats
        if (Array.isArray(response)) {
          // Direct array response
          if (isPolicyArray(response)) {
            policiesData = response;
          }
        } else if (response && typeof response === "object") {
          // Response with data property
          if ("data" in response && Array.isArray(response.data)) {
            if (isPolicyArray(response.data)) {
              policiesData = response.data;
            }
          }
        }

        console.log("Processed policy data:", policiesData);
        setPolicies(policiesData);
        setError(null);
      } catch (err) {
        console.error("Error fetching policies:", err);
        setError("Failed to load policies. Please try again later.");
        setPolicies([]);
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

      {!policies || policies.length === 0 ? (
        <p>No policies found. Create a new one to get started.</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Policy Name</th>
              <th>Status</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {policies.map((policy) => (
              <tr key={policy.id}>
                <td>{policy.policyName}</td>
                <td>{policy.status}</td>
                <td>
                  {new Date(policy.coverageStartDate).toLocaleDateString()}
                </td>
                <td>{new Date(policy.coverageEndDate).toLocaleDateString()}</td>
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
