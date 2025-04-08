import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { policyApi } from "../api/insuranceApiService";
import Alert from "../components/Alert";
import Loading from "../components/Loading";
import {
  DEFAULT_PAGE,
  DEFAULT_PAGE_SIZE,
  DEFAULT_SORT_DIRECTION,
  DEFAULT_SORT_FIELD,
  PAGE_SIZE_OPTIONS,
} from "../constants/paginationConfig";
import { Policy } from "../types";

const Policies = () => {
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(DEFAULT_PAGE);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [sortField, setSortField] = useState(DEFAULT_SORT_FIELD);
  const [sortDirection, setSortDirection] = useState(DEFAULT_SORT_DIRECTION);

  useEffect(() => {
    fetchPolicies();
  }, [currentPage, pageSize, sortField, sortDirection]);

  const fetchPolicies = async () => {
    try {
      setLoading(true);
      const response = await policyApi.getPaginated(
        currentPage,
        pageSize,
        sortField,
        sortDirection
      );

      if (response && response.content) {
        setPolicies(response.content);
        setTotalPages(response.totalPages);
        setTotalElements(response.totalElements);
        setError(null);
      } else {
        console.error("Unexpected response format:", response);
        setError("Failed to load policies. Unexpected response format.");
        setPolicies([]);
      }
    } catch (err) {
      console.error("Error fetching policies:", err);
      setError("Failed to load policies. Please try again later.");
      setPolicies([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePolicy = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this policy?")) {
      try {
        await policyApi.delete(id);
        // Refresh the current page after deletion
        fetchPolicies();
      } catch (err) {
        console.error("Error deleting policy:", err);
        setError("Failed to delete policy. Please try again later.");
      }
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 0 && newPage < totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleSort = (field: string) => {
    if (field === sortField) {
      // Toggle sort direction if clicking the same field
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      // Set new sort field and default to ascending
      setSortField(field);
      setSortDirection("asc");
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
        <>
          <table className="table">
            <thead>
              <tr>
                <th onClick={() => handleSort("policyName")}>
                  Policy Name{" "}
                  {sortField === "policyName" &&
                    (sortDirection === "asc" ? "▲" : "▼")}
                </th>
                <th onClick={() => handleSort("status")}>
                  Status{" "}
                  {sortField === "status" &&
                    (sortDirection === "asc" ? "▲" : "▼")}
                </th>
                <th onClick={() => handleSort("coverageStartDate")}>
                  Start Date{" "}
                  {sortField === "coverageStartDate" &&
                    (sortDirection === "asc" ? "▲" : "▼")}
                </th>
                <th onClick={() => handleSort("coverageEndDate")}>
                  End Date{" "}
                  {sortField === "coverageEndDate" &&
                    (sortDirection === "asc" ? "▲" : "▼")}
                </th>
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
                  <td>
                    {new Date(policy.coverageEndDate).toLocaleDateString()}
                  </td>
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

          <div className="pagination">
            <button
              onClick={() => handlePageChange(0)}
              disabled={currentPage === 0}
            >
              First
            </button>
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 0}
            >
              Previous
            </button>
            <span>
              Page {currentPage + 1} of {totalPages}
              {totalElements > 0 && ` • Total: ${totalElements}`}
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage >= totalPages - 1}
            >
              Next
            </button>
            <button
              onClick={() => handlePageChange(totalPages - 1)}
              disabled={currentPage >= totalPages - 1}
            >
              Last
            </button>
            <select
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
              aria-label="Items per page"
              title="Items per page"
            >
              {PAGE_SIZE_OPTIONS.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>
        </>
      )}
    </div>
  );
};

export default Policies;
