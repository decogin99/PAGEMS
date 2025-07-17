import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';
import signalRService from '../services/signalRService';
import { useTheme } from './ThemeContext';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showDisabledNotification, setShowDisabledNotification] = useState(false);
    const { darkMode } = useTheme();

    useEffect(() => {
        const user = authService.getCurrentUser();
        if (user) {
            setUser(user);
        }
        setLoading(false);
    }, []);

    // Add SignalR listener for account updates
    useEffect(() => {
        if (user) {
            // Set up listener for AccountUpdate events
            const unsubscribe = signalRService.on('AccountDeactivated', async (accountId) => {
                try {
                    // Only check status if the updated account is the current user's account
                    if (accountId && accountId === user.accountId) {
                        setShowDisabledNotification(true);
                    }
                } catch (error) {
                    console.error('Error checking account status:', error);
                }
            });

            // Clean up listener when component unmounts or user changes
            return () => {
                unsubscribe();
            };
        }
    }, [user]);

    // Add SignalR listener for permission updates
    useEffect(() => {
        if (user) {
            // Set up listener for AccountDeactivated events
            const unsubscribeDeactivated = signalRService.on('AccountDeactivated', async (accountId) => {
                try {
                    // Only check status if the updated account is the current user's account
                    if (accountId && accountId === user.accountId) {
                        setShowDisabledNotification(true);
                    }
                } catch (error) {
                    console.error('Error checking account status:', error);
                }
            });

            // Set up listener for PermissionUpdated events
            const unsubscribePermissionUpdated = signalRService.on('PermissionUpdated', async (data) => {
                try {
                    // Only update permissions if the updated account is the current user's account
                    if (data.accountId && data.accountId === user.accountId) {
                        // Fetch updated permissions
                        await fetchAccountPermissions();
                    }
                } catch (error) {
                    console.error('Error updating permissions:', error);
                }
            });

            // Clean up listeners when component unmounts or user changes
            return () => {
                unsubscribeDeactivated();
                unsubscribePermissionUpdated();
            };
        }
    }, [user]);

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

    const handleCloseNotification = async () => {
        setShowDisabledNotification(false);
        await logout();
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

            {/* Account Disabled Notification Modal */}
            {showDisabledNotification && (
                <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                    <div className="flex items-center justify-center min-h-screen p-4 text-center">
                        <div className="fixed inset-0 backdrop-blur-sm bg-opacity-75 transition-opacity" aria-hidden="true"></div>
                        <div className={`relative inline-block align-middle ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:max-w-lg w-full p-6`}>
                            <div className="text-center">
                                <div className="flex justify-center mb-4">
                                    <svg className="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                    </svg>
                                </div>
                                <h3 className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>Your account has been disabled!</h3>
                                <p className={`${darkMode ? 'text-gray-300' : 'text-gray-500'} mb-6`}>You will be logged out of the system. Please contact your administrator for assistance.</p>
                                <div className="flex justify-center">
                                    <button
                                        onClick={handleCloseNotification}
                                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                                    >
                                        OK
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
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