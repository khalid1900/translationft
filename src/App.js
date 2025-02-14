import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { ClientLogin, ClientSignup, MyFiles } from "./Client";
import { AdminLogin, AdminFiles, AdminSignup } from "./Admin";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  const [user, setUser] = useState(null);
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("clientToken");
    const adminToken = localStorage.getItem("adminToken");

    setUser(token || null);
    setAdmin(adminToken || null);

    setLoading(false);
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/client/login" />} />
        <Route path="/client/login" element={<ClientLogin setUser={setUser} />} />
        <Route path="/client/files" element={user ? <MyFiles user={user} setUser={setUser} /> : <Navigate to="/client/login" />} />
        <Route path="/admin/login" element={<AdminLogin setAdmin={setAdmin} />} />
        <Route path="/admin/files" element={admin ? <AdminFiles setAdmin={setAdmin} /> : <Navigate to="/admin/login" />} />
        <Route path="/admin/signup" element={<AdminSignup />} />
        <Route path="/client/signup" element={<ClientSignup />} />
      </Routes>
    </Router>
  );
}

export default App;
