import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { policyApi } from "../api/apiClient";
import Alert from "../components/Alert";
import Loading from "../components/Loading";
import { Policy } from "../types";

const PolicyDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [policy, setPolicy] = useState<Policy | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPolicy = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const response = await policyApi.getById(Number(id));
        setPolicy(response.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching policy:", err);
        setError("Failed to load policy details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchPolicy();
  }, [id]);

  const handleDeletePolicy = async () => {
    if (!policy) return;

    if (window.confirm("Are you sure you want to delete this policy?")) {
      try {
        await policyApi.delete(policy.id);
        navigate("/policies");
      } catch (err) {
        console.error("Error deleting policy:", err);
        setError("Failed to delete policy. Please try again later.");
      }
    }
  };

  if (loading) return <Loading />;
  if (error) return <Alert type="error">{error}</Alert>;
  if (!policy) return <Alert type="error">Policy not found.</Alert>;

  return (
    <div>
      <div
        className="form-row"
        style={{ justifyContent: "space-between", alignItems: "center" }}
      >
        <h1>Policy Details</h1>
        <div className="action-buttons">
          <Link to="/policies">
            <button>Back to Policies</button>
          </Link>
          <Link to={`/policies/edit/${policy.id}`}>
            <button className="btn-edit">Edit Policy</button>
          </Link>
          <button className="btn-delete" onClick={handleDeletePolicy}>
            Delete Policy
          </button>
        </div>
      </div>

      <div className="card">
        <h2>Policy Information</h2>
        <div className="form-row">
          <div style={{ flex: 1 }}>
            <p>
              <strong>Policy Number:</strong> {policy.policyNumber}
            </p>
            <p>
              <strong>Type:</strong> {policy.type}
            </p>
            <p>
              <strong>Status:</strong> {policy.status}
            </p>
            <p>
              <strong>Premium:</strong> ${policy.premium.toFixed(2)}
            </p>
          </div>
          <div style={{ flex: 1 }}>
            <p>
              <strong>Start Date:</strong>{" "}
              {new Date(policy.startDate).toLocaleDateString()}
            </p>
            <p>
              <strong>End Date:</strong>{" "}
              {new Date(policy.endDate).toLocaleDateString()}
            </p>
            <p>
              <strong>Coverage Amount:</strong> $
              {policy.coverageAmount.toFixed(2)}
            </p>
            <p>
              <strong>Created:</strong>{" "}
              {new Date(policy.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      {policy.client && (
        <div className="card">
          <h2>Client Information</h2>
          <div className="form-row">
            <div style={{ flex: 1 }}>
              <p>
                <strong>Name:</strong>{" "}
                {`${policy.client.firstName} ${policy.client.lastName}`}
              </p>
              <p>
                <strong>Email:</strong> {policy.client.email}
              </p>
              <p>
                <strong>Phone:</strong> {policy.client.phoneNumber}
              </p>
            </div>
            <div style={{ flex: 1 }}>
              <p>
                <strong>Address:</strong> {policy.client.address}
              </p>
              <p>
                <strong>Date of Birth:</strong>{" "}
                {new Date(policy.client.dateOfBirth).toLocaleDateString()}
              </p>
              <Link to={`/clients/${policy.client.id}`}>
                <button>View Client Details</button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PolicyDetails;
