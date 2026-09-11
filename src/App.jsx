import { BrowserRouter, Routes, Route } from "react-router-dom";

import LandingPage from "./pages/LandingPage/LandingPage";
import AboutUs from "./pages/AboutUs/AboutUs";
import FindBlood from "./pages/FindBlood/FindBlood";
import Register from "./pages/Register/Register";
import Login from "./pages/Login/Login";
import DonorDashboard from "./pages/DonorDashboard/DonorDashboard";
import OrganizationDashboard from "./pages/OrganizationDashboard/OrganizationDashboard";
import AdminDashboard from "./pages/AdminDashboard/AdminDashboard";
import ScanResult from "./pages/ScanResult/ScanResult";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/find-blood" element={<FindBlood />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        <Route
          path="/donor-dashboard/*"
          element={
            <ProtectedRoute role="donor">
              <DonorDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/organization-dashboard/*"
          element={
            <ProtectedRoute role="organization">
              <OrganizationDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin-dashboard/*"
          element={
            <ProtectedRoute role="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route path="/scan-result" element={<ScanResult />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;