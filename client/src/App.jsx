
import {
    BrowserRouter,
    Routes,
    Route,
    Navigate
} from "react-router-dom";

import Navbar from "./components/Navbar";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import History from "./pages/History";
import AdminDashboard from "./pages/AdminDashboard";

import ProtectedRoute from "./components/ProtectedRoute";

function App() {

    return (
        <BrowserRouter>

            <Navbar />

            <Routes>

                {/* Public routes */}
                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/register"
                    element={<Register />}
                />

                {/* User dashboard */}
                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute allowedRoles={["USER", "ADMIN"]}>
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />

                {/* User history */}
                <Route
                    path="/history"
                    element={
                        <ProtectedRoute allowedRoles={["USER", "ADMIN"]}>
                            <History />
                        </ProtectedRoute>
                    }
                />

                {/* Admin dashboard */}
                <Route
                    path="/admin/dashboard"
                    element={
                        <ProtectedRoute allowedRoles={["ADMIN"]}>
                            <AdminDashboard />
                        </ProtectedRoute>
                    }
                />

                {/* Default route */}
                <Route
                    path="/"
                    element={<Navigate to="/login" replace />}
                />

                <Route
                    path="*"
                    element={<Navigate to="/login" replace />}
                />

            </Routes>

        </BrowserRouter>
    );
}

export default App;
