import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const user = authService.getCurrentUser();
        if (user) {
            setUser(user);
        }
        setLoading(false);
    }, []);

    const login = async (username, password, rememberMe = false) => {
        const response = await authService.login(username, password, rememberMe);
        if (response.success && response.data) {
            localStorage.setItem('user', JSON.stringify(response.data.userInfo));
            setUser(response.data.userInfo);
        }
        return response;
    };

    const logout = async () => {
        await authService.logout();
        setUser(null);
    };

    const fetchAccountPermissions = async () => {
        const response = await authService.fetchAccountPermissions();
        if (response.success && response.data) {
            setUser(response.data);
        }
        return response;
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout, fetchAccountPermissions }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};