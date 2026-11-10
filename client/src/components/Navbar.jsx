
import { Link, useNavigate } from "react-router-dom";

import {
    FaNotesMedical,
    FaHistory,
    FaSignOutAlt,
    FaUserShield
} from "react-icons/fa";

import { motion } from "framer-motion";

function Navbar() {

    const navigate = useNavigate();

    const token = localStorage.getItem("token");

    let user = null;

    try {
        user = JSON.parse(localStorage.getItem("user") || "null");
    } catch {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
    }

    const isLoggedIn = Boolean(token && user);
    const isAdmin = user?.role === "ADMIN";

    const handleLogout = () => {

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/login", { replace: true });
    };

    return (

        <motion.nav
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-gradient-to-r from-blue-700 to-cyan-600 text-white px-6 py-4 shadow-lg sticky top-0 z-50"
        >

            <div className="max-w-7xl mx-auto flex justify-between items-center">

                {/* Logo */}
                <Link to={isLoggedIn ? (isAdmin ? "/admin/dashboard" : "/dashboard") : "/login"}
                    className="flex items-center gap-3"
                >
                    <FaUserShield className="text-3xl" />

                    <h1 className="text-3xl font-bold tracking-wide">
                        MediScan AI
                    </h1>
                </Link>

                {/* Navigation */}
                <div className="flex items-center gap-6 text-lg">

                    {!isLoggedIn && (
                        <>
                            <Link
                                to="/login"
                                className="hover:text-yellow-300 transition"
                            >
                                Login
                            </Link>

                            <Link
                                to="/register"
                                className="hover:text-yellow-300 transition"
                            >
                                Register
                            </Link>
                        </>
                    )}

                    {isLoggedIn && !isAdmin && (
                        <>
                            <Link
                                to="/dashboard"
                                className="flex items-center gap-2 hover:text-yellow-300 transition"
                            >
                                <FaNotesMedical />
                                Dashboard
                            </Link>

                            <Link
                                to="/history"
                                className="flex items-center gap-2 hover:text-yellow-300 transition"
                            >
                                <FaHistory />
                                History
                            </Link>
                        </>
                    )}

                    {isLoggedIn && isAdmin && (
                        <Link
                            to="/admin/dashboard"
                            className="flex items-center gap-2 hover:text-yellow-300 transition"
                        >
                            <FaUserShield />
                            Admin Dashboard
                        </Link>
                    )}

                    {isLoggedIn && (
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 bg-red-500 hover:bg-red-600 px-4 py-2 rounded-xl transition"
                        >
                            <FaSignOutAlt />
                            Logout
                        </button>
                    )}

                </div>

            </div>

        </motion.nav>
    );
}

export default Navbar;
