import { lazy, Suspense } from "react";
import { Link, Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./App.css";

// Lazy load components
const Home = lazy(() => import("./pages/Home"));
const Policies = lazy(() => import("./pages/Policies"));
const PolicyDetails = lazy(() => import("./pages/PolicyDetails"));
const CreatePolicy = lazy(() => import("./pages/CreatePolicy"));
const EditPolicy = lazy(() => import("./pages/EditPolicy"));
const Clients = lazy(() => import("./pages/Clients"));
const ClientDetails = lazy(() => import("./pages/ClientDetails"));
const CreateClient = lazy(() => import("./pages/CreateClient"));
const EditClient = lazy(() => import("./pages/EditClient"));

function App() {
  return (
    <Router>
      <div className="app">
        <header className="header">
          <div className="container">
            <div className="logo">
              <Link to="/">Insurance Policy Manager</Link>
            </div>
            <nav className="nav-links">
              <Link to="/">Home</Link>
              <Link to="/policies">Policies</Link>
              <Link to="/clients">Clients</Link>
            </nav>
          </div>
        </header>

        <main className="main-content">
          <div className="container">
            <Suspense fallback={<div className="loading">Loading...</div>}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/policies" element={<Policies />} />
                <Route path="/policies/:id" element={<PolicyDetails />} />
                <Route path="/policies/create" element={<CreatePolicy />} />
                <Route path="/policies/edit/:id" element={<EditPolicy />} />
                <Route path="/clients" element={<Clients />} />
                <Route path="/clients/:id" element={<ClientDetails />} />
                <Route path="/clients/create" element={<CreateClient />} />
                <Route path="/clients/edit/:id" element={<EditClient />} />
              </Routes>
            </Suspense>
          </div>
        </main>

        <footer className="footer">
          <div className="container">
            <p>&copy; {new Date().getFullYear()} Insurance Policy Manager</p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
