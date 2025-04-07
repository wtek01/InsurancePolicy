import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { policyApi } from "../api/apiClient";
import Alert from "../components/Alert";
import Loading from "../components/Loading";
import PolicyForm from "../components/PolicyForm";
import { CreatePolicyRequest, Policy } from "../types";

const EditPolicy = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [policy, setPolicy] = useState<Policy | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPolicy = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const response = await policyApi.getById(Number(id));
        console.log("API Response for edit policy:", response);

        // Handle the response properly
        if (response) {
          if ("data" in response && response.data) {
            setPolicy(response.data);
          } else if (
            typeof response === "object" &&
            response !== null &&
            "id" in response &&
            "policyName" in response
          ) {
            setPolicy(response as Policy);
          } else {
            throw new Error("Invalid response format");
          }
          setError(null);
        } else {
          console.error("No policy data found in response");
          setError("Failed to load policy data. Policy not found.");
          setPolicy(null);
        }
      } catch (err) {
        console.error("Error fetching policy:", err);
        setError("Failed to load policy data. Please try again later.");
        setPolicy(null);
      } finally {
        setLoading(false);
      }
    };

    fetchPolicy();
  }, [id]);

  const handleSubmit = async (policyData: CreatePolicyRequest) => {
    if (!policy) return;

    try {
      setSaving(true);
      // Combine policy ID with form data
      const updateData = {
        ...policyData,
        id: policy.id,
      };

      const response = await policyApi.update(updateData);
      console.log("Update response:", response);

      if (response && (response.data || "id" in response)) {
        navigate(`/policies/${policy.id}`);
      } else {
        setError("Failed to update policy. Unexpected response from server.");
      }
    } catch (err) {
      console.error("Error updating policy:", err);
      setError("Failed to update policy. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loading />;
  if (error && !policy) return <Alert type="error">{error}</Alert>;
  if (!policy) return <Alert type="error">Policy not found.</Alert>;

  return (
    <div>
      <h1>Edit Policy</h1>
      {error && <Alert type="error">{error}</Alert>}
      <div className="card">
        <PolicyForm
          policy={policy}
          onSubmit={handleSubmit}
          isLoading={saving}
        />
      </div>
    </div>
  );
};

export default EditPolicy;
