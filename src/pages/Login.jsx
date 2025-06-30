import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import pagLogo from "../assets/PAG_Icon_Transparent.png";

const Login = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [formData, setFormData] = useState({
        username: "",
        password: ""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        setError(""); // Clear error when user types
    };

    const handleLogin = (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        // Check static credentials
        if (formData.username === "admin" && formData.password === "admin") {
            setTimeout(() => {
                setLoading(false);
                navigate("/PAGEMS/dashboard");
            }, 1000);
        } else {
            setTimeout(() => {
                setLoading(false);
                setError("Invalid username or password");
            }, 1000);
        }
    };

    return (
        <div className="fixed inset-0 flex flex-col bg-gradient-to-br from-[#0054A6]/5 to-white items-center justify-center px-4 sm:px-6">
            <div className="w-full max-w-sm sm:max-w-md bg-white shadow-2xl rounded-2xl p-8 space-y-8">
                <div className="text-center space-y-1 mb-3">
                    <img
                        src={pagLogo}
                        alt="PAG Logo"
                        className="h-40 mx-auto"
                    />
                    <p className="text-gray-600 text-sm font-medium sm:text-base">
                        Sign in to your account
                    </p>
                </div>

                <form className="space-y-4" onSubmit={handleLogin}>
                    {error && (
                        <div className="bg-red-500 text-white text-sm py-3 px-4 rounded-lg border border-red-200">
                            {error}
                        </div>
                    )}

                    <div className="space-y-1.5">
                        <label
                            htmlFor="username"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Username
                        </label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-base placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0054A6] focus:border-transparent transition"
                            placeholder="Enter username"
                            disabled={loading}
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label
                            htmlFor="password"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-base placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0054A6] focus:border-transparent transition"
                            placeholder="••••••••"
                            disabled={loading}
                        />
                    </div>

                    <div className="flex items-center">
                        <label className="flex items-center gap-2 cursor-pointer select-none">
                            <input
                                type="checkbox"
                                className="accent-[#0054A6] w-4 h-4"
                                disabled={loading}
                            />
                            <span className="text-sm text-gray-600">Remember me</span>
                        </label>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-3.5 rounded-lg text-white text-base font-medium transition
                            ${loading
                                ? "bg-[#0054A6]/70 cursor-not-allowed"
                                : "bg-[#0054A6] hover:bg-[#004080] active:bg-[#003366] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0054A6]"}
                        `}
                    >
                        {loading ? (
                            <span className="flex items-center justify-center gap-2">
                                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                        fill="none"
                                    />
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    />
                                </svg>
                                Signing in...
                            </span>
                        ) : (
                            "Sign in"
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
