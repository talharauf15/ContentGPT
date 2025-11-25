import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from "@clerk/clerk-react";
// import Home from "./pages/Home";
// import Logs from "./pages/Logs";
import TestPromptAPI from "./components/testPromptAPI";
// import Agents from "./pages/Agents";
import { BrandStrategyAgent, Agents, Home, Logs, LandingPageAgent } from "./pages";
import "./App.css";

function Navigation() {
  const location = useLocation();
  
  return (
    <nav className="navbar">
      <div className="navbar-links">
        <Link 
          to="/" 
          className={`navbar-link ${location.pathname === "/" ? "active" : ""}`}
        >
          Home
        </Link>
        <Link 
          to="/logs" 
          className={`navbar-link ${location.pathname === "/logs" ? "active" : ""}`}
        >
          Logs
        </Link>
        <Link 
          to="/agents" 
          className={`navbar-link ${location.pathname.startsWith("/agents") ? "active" : ""}`}
        >
          Agents
        </Link>
      </div>
      <div className="user-button-container">
        <UserButton />
      </div>
    </nav>
  );
}

function App() {
  return (
    <div className="app-container">
      <SignedOut>
        <div className="signed-out-container">
          <div className="signed-out-content">
            <h2>Welcome to the Smart Agent App</h2>
            <p style={{ marginBottom: "2rem", opacity: 0.9 }}>
              Please sign in or sign up to continue
            </p>
            <div className="auth-buttons">
              <SignUpButton mode="modal" />
              <SignInButton mode="modal" />
            </div>
          </div>
        </div>
      </SignedOut>
      
      <SignedIn>
        <Router>
          <Navigation />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/logs" element={<Logs />} />
              <Route path="/test-prompt" element={<TestPromptAPI />} />
              <Route path="/agents" element={<Agents />} />
              <Route path="/agents/brand-strategy" element={<BrandStrategyAgent />} />
              <Route path="/agents/landing-page" element={<LandingPageAgent />} />
            </Routes>
          </main>
        </Router>
      </SignedIn>
    </div>
  );
}

export default App;
