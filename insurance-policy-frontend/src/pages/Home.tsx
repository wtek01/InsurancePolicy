import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div>
      <h1>Insurance Policy Manager</h1>
      <p className="mb-4">Welcome to the Insurance Policy Management System.</p>

      <div className="card">
        <h2>Quick Links</h2>
        <div className="form-row" style={{ marginTop: "1rem" }}>
          <Link to="/policies">
            <button>View All Policies</button>
          </Link>
          <Link to="/policies/create">
            <button>Create New Policy</button>
          </Link>
        </div>
      </div>

      <div className="card">
        <h2>About This Application</h2>
        <p>
          This application allows insurance agents to manage policies. You can
          create, view, update, and delete insurance policies.
        </p>
      </div>
    </div>
  );
};

export default Home;
