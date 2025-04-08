import { lazy, Suspense } from "react";
import { Link, Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./App.css";

// Lazy load components
const Home = lazy(() => import("./pages/Home"));
const Policies = lazy(() => import("./pages/Policies"));
const PolicyDetails = lazy(() => import("./pages/PolicyDetails"));
const CreatePolicy = lazy(() => import("./pages/CreatePolicy"));
const EditPolicy = lazy(() => import("./pages/EditPolicy"));

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
