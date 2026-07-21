import { Routes, Route } from "react-router-dom";
import Login from "./pages/login"; 
import Signup from "./pages/signup";
import Dashboard from "./pages/dashboard";
import ProtectedRoute from "./components/layout/ProtectedRoute";
import Predict from "./pages/Predict";
import Result from "./pages/Result";
import History from "./pages/History";
import PredictionDetails from "./pages/PredictionDetails";
import Landing from "./pages/landing";
function App() {
  return (
    <Routes>

      <Route
        path="/"
        element={<Landing />}
      />

      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/signup"
        element={<Signup />}
      />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />


      <Route
        path="/predict"
        element={
          <ProtectedRoute>
            <Predict />
          </ProtectedRoute>
        }
      />

      <Route
        path="/result"
        element={
          <ProtectedRoute>
            <Result />
          </ProtectedRoute>
        }
      />

      <Route
        path="/history"
        element={
          <ProtectedRoute>
            <History />
          </ProtectedRoute>
        }
      />

      <Route
        path="/history/:id"
        element={
          <ProtectedRoute>
            <PredictionDetails />
          </ProtectedRoute>
        }
      />

    </Routes>
  );
}

export default App;