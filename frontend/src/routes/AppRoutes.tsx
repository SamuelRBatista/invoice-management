import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Dashboard from "../pages/dashboard/Dashboard"; // <- único Dashboard genérico
import LoginPage from "../pages/login/LoginPage";
import ProtectedRoute from "./ProtectedRoute";

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
       
        <Route path="/" element={<LoginPage />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={["admin", "pj"]}>
              <Dashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
