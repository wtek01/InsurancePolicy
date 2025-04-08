import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { policyApi } from "../api/insuranceApiService";
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
        console.log("API Response for policy details:", response);

        // Handle the response properly
        if (response) {
          if ("data" in response && response.data) {
            // Response with data property
            setPolicy(response.data);
          } else if (isPolicyObject(response)) {
            // Direct policy object response
            setPolicy(response);
          } else {
            throw new Error("Invalid response format");
          }
          setError(null);
        } else {
          console.error("No policy data found in response:", response);
          setError("Failed to load policy data. Policy not found.");
          setPolicy(null);
        }
      } catch (err) {
        console.error("Error fetching policy:", err);
        setError("Failed to load policy details. Please try again later.");
        setPolicy(null);
      } finally {
        setLoading(false);
      }
    };

    fetchPolicy();
  }, [id]);

  // Type guard to check if the response is a Policy object
  const isPolicyObject = (obj: unknown): obj is Policy => {
    return !!(
      obj &&
      typeof obj === "object" &&
      obj !== null &&
      "id" in obj &&
      "policyName" in obj &&
      "status" in obj &&
      "coverageStartDate" in obj &&
      "coverageEndDate" in obj
    );
  };

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
              <strong>Policy Name:</strong> {policy.policyName}
            </p>
            <p>
              <strong>Status:</strong> {policy.status}
            </p>
          </div>
          <div style={{ flex: 1 }}>
            <p>
              <strong>Start Date:</strong>{" "}
              {new Date(policy.coverageStartDate).toLocaleDateString()}
            </p>
            <p>
              <strong>End Date:</strong>{" "}
              {new Date(policy.coverageEndDate).toLocaleDateString()}
            </p>
            <p>
              <strong>Created:</strong>{" "}
              {new Date(policy.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PolicyDetails;
