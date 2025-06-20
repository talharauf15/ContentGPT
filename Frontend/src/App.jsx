import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from "@clerk/clerk-react";
import Home from "./pages/Home";
import Logs from "./pages/Logs";

function App() {
  return (
    <>
      <SignedOut>
        <div style={{ padding: "2rem", textAlign: "center" }}>
          <h2>Please sign in or sign up to continue</h2>
          <SignUpButton mode="modal" />
          <SignInButton mode="modal" />
        </div>
      </SignedOut>

      <SignedIn>
        <Router>
          <nav style={{ display: "flex", gap: "1rem", padding: "1rem", borderBottom: "1px solid #ccc" }}>
            <UserButton />
            <Link to="/">Home</Link>
            <Link to="/logs">Logs</Link>
          </nav>

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/logs" element={<Logs />} />
          </Routes>
        </Router>
      </SignedIn>
    </>
  );
}

export default App;
