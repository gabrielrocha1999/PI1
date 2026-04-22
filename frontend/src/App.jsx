import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PatientDashboard from "./pages/PatientDashboard";
import PsychologistDashboard from "./pages/PsychologistDashboard";
import PatientTasks from "./pages/PatientTasks";

function ProtectedRoute({ children, allowedType }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (allowedType && user.tipo !== allowedType) {
    return <Navigate to={user.tipo === "patient" ? "/dashboard" : "/psychologist"} replace />;
  }
  return children;
}

function PublicRoute({ children }) {
  const { user } = useAuth();
  if (user) {
    return <Navigate to={user.tipo === "patient" ? "/dashboard" : "/psychologist"} replace />;
  }
  return children;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />

      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute allowedType="patient">
            <PatientDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/psychologist"
        element={
          <ProtectedRoute allowedType="psychologist">
            <PsychologistDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/psychologist/patients/:patientId"
        element={
          <ProtectedRoute allowedType="psychologist">
            <PatientTasks />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
