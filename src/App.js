import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/dashboard";
import Orders from "./pages/orders";
import Services from "./pages/services";
import Karyawan from "./pages/karyawan";
import Login from "./pages/login";
import LandingPage from "./pages/landingPages";
import PrivateRoute from "./services/privateRoutes";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <PrivateRoute>
              <Orders />
            </PrivateRoute>
          }
        />
        <Route
          path="/services"
          element={
            <PrivateRoute>
              <Services />
            </PrivateRoute>
          }
        />
        <Route
          path="/karyawan"
          element={
            <PrivateRoute>
              <Karyawan />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
