import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import pagLogo from "../assets/PAG_Icon_Transparent.png";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";

const Login = () => {
    const { darkMode, toggleDarkMode } = useTheme();
    const { login } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [formData, setFormData] = useState({
        username: "",
        password: "",
        rememberMe: false,
    });

    const handleChange = (e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setFormData({
            ...formData,
            [e.target.name]: value
          });
        setError("");
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const response = await login(formData.username, formData.password, formData.rememberMe);
            if (response.success) {
                navigate("/dashboard");
            } else {
                setError(response.message);
            }
        } catch {
            setError("An unexpected error occurred");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={`fixed inset-0 flex flex-col items-center justify-center px-4 sm:px-6 ${darkMode ? 'bg-gradient-to-br from-gray-900 to-gray-800' : 'bg-gradient-to-br from-[#0054A6]/5 to-white'}`}>
            {/* Dark Mode Toggle Button - Outside form, top right */}
            <button
                onClick={toggleDarkMode}
                className={`fixed top-4 right-4 p-3 rounded-full transition-all duration-300 ${darkMode ? 'bg-yellow-400 text-gray-900' : 'bg-gray-800 text-white'} shadow-lg hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 ${darkMode ? 'focus:ring-yellow-500' : 'focus:ring-gray-700'}`}
                aria-label="Toggle dark mode"
            >
                {darkMode ? (
                    <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                        </svg>
                    </div>
                ) : (
                    <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                        </svg>
                    </div>
                )}
            </button>

            <div className={`w-full max-w-sm sm:max-w-md ${darkMode ? 'bg-gray-800 shadow-xl shadow-black/20' : 'bg-white shadow-2xl'} rounded-2xl p-8 space-y-8`}>
                <div className="text-center space-y-1 mb-3">
                    <img
                        src={pagLogo}
                        alt="PAG Logo"
                        className="h-40 mx-auto"
                    />
                    <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} text-sm font-medium sm:text-base`}>
                        Sign in to your account
                    </p>
                </div>

                <form className="space-y-4" onSubmit={handleLogin}>
                    {error && (
                        <div className="bg-red-500 text-white text-sm py-3 px-4 rounded-lg">
                            {error}
                        </div>
                    )}

                    <div className="space-y-1.5">
                        <label
                            htmlFor="username"
                            className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}
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
                            className={`w-full px-4 py-3 border rounded-lg text-base placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0054A6] focus:border-transparent transition ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-300 text-gray-900'}`}
                            placeholder="Enter username"
                            disabled={loading}
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label
                            htmlFor="password"
                            className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}
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
                            className={`w-full px-4 py-3 border rounded-lg text-base placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0054A6] focus:border-transparent transition ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-300 text-gray-900'}`}
                            placeholder="••••••••"
                            disabled={loading}
                        />
                    </div>

                    <div className="flex items-center">
                        <label className="flex items-center gap-2 cursor-pointer select-none">
                            <input
                                type="checkbox"
                                id="rememberMe"
                                name="rememberMe"
                                checked={formData.rememberMe}
                                onChange={handleChange}
                                className="accent-[#0054A6] w-4 h-4"
                                disabled={loading}
                            />
                            <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Remember me</span>
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
