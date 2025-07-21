import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import authService from '../services/authService';
import signalRService from '../services/signalRService';
import { useTheme } from './ThemeContext';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showDisabledNotification, setShowDisabledNotification] = useState(false);
    const [onlineUsers, setOnlineUsers] = useState(new Set());
    const [connectionStatus, setConnectionStatus] = useState('Disconnected');
    const { darkMode } = useTheme();
    const userOfflineTimeouts = useRef({});

    useEffect(() => {
        const initializeUser = async () => {
            const user = authService.getCurrentUser();
            if (user) {
                setUser(user);
                setOnlineUsers(prev => new Set([...prev, user.accountId]));

                // Always fetch permissions on initial load to ensure they're up to date
                try {
                    const permissions = await authService.fetchAccountPermissions();
                    if (permissions) {
                        setUser(prev => ({ ...prev, permissions }));
                    }
                } catch (error) {
                    console.error('Error fetching permissions:', error);
                }
            }
            setLoading(false);
        };

        initializeUser();
    }, []);

    // Monitor SignalR connection status
    useEffect(() => {
        if (!user) return;

        const onConnected = () => setConnectionStatus('Connected');
        const onDisconnected = () => setConnectionStatus('Disconnected');
        const onReconnecting = () => setConnectionStatus('Reconnecting');

        // Set initial status
        const checkConnectionStatus = () => {
            if (!signalRService.connection) {
                setConnectionStatus('Disconnected');
                return;
            }
            setConnectionStatus(signalRService.connection.state);
        };

        // Check status immediately
        checkConnectionStatus();

        // Register connection status listeners
        signalRService.connection?.onclose(onDisconnected);
        signalRService.connection?.onreconnecting(onReconnecting);
        signalRService.connection?.onreconnected(onConnected);

        // Check status periodically - this is important to keep
        const intervalId = setInterval(checkConnectionStatus, 1000);

        return () => {
            clearInterval(intervalId);
            // SignalR doesn't provide a direct way to remove these listeners
        };
    }, [user]);

    // Handle online/offline users
    useEffect(() => {
        if (!user) return;

        // Set up listener for UserOnline events
        const unsubscribeUserOnline = signalRService.on('UserOnline', (userId) => {
            // Clear any pending offline timeout for this user
            if (userOfflineTimeouts.current[userId]) {
                clearTimeout(userOfflineTimeouts.current[userId]);
                delete userOfflineTimeouts.current[userId];
            }
            setOnlineUsers(prev => new Set([...prev, userId]));
        });

        // Set up listener for UserOffline events
        const unsubscribeUserOffline = signalRService.on('UserOffline', (userId) => {
            // Add a timeout to delay processing the offline status
            const timeoutId = setTimeout(() => {
                setOnlineUsers(prev => {
                    const newSet = new Set([...prev]);
                    newSet.delete(userId);
                    return newSet;
                });
            }, 5000); // 5-second grace period

            userOfflineTimeouts.current[userId] = timeoutId;
        });

        return () => {
            unsubscribeUserOnline();
            unsubscribeUserOffline();

            // Clear any pending timeouts
            Object.values(userOfflineTimeouts.current).forEach(clearTimeout);
            userOfflineTimeouts.current = {};
        };
    }, [user]);

    // Handle visibility change
    useEffect(() => {
        if (!user) return;

        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible' &&
                signalRService.connection?.state === 'Disconnected') {
                signalRService.reconnect();
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
    }, [user]);

    // Handle account and permission updates
    useEffect(() => {
        if (!user) return;

        // Set up listener for AccountDeactivated events
        const unsubscribeDeactivated = signalRService.on('AccountDeactivated', (accountId) => {
            if (accountId === user.accountId) {
                setShowDisabledNotification(true);
            }
        });

        // Set up listener for PermissionUpdated events
        const unsubscribePermissionUpdated = signalRService.on('PermissionUpdated', (data) => {
            if (data.accountId === user.accountId) {
                fetchAccountPermissions();
            }
        });

        return () => {
            unsubscribeDeactivated();
            unsubscribePermissionUpdated();
        };
    }, [user]);

    // Fetch online users when connection is established
    useEffect(() => {
        if (user && connectionStatus === 'Connected') {
            signalRService.connection.invoke('GetOnlineUsers')
                .then(onlineUserIds => setOnlineUsers(new Set(onlineUserIds)))
                .catch(err => console.error('Error getting online users:', err));
        }
    }, [user, connectionStatus]);

    const login = async (username, password, rememberMe = false) => {
        const response = await authService.login(username, password, rememberMe);
        if (response.success && response.data) {
            localStorage.setItem('user', JSON.stringify(response.data.userInfo));
            setUser(response.data.userInfo);
        }
        return response;
    };

    const logout = async () => {
        const currentUser = await authService.logout();
        if (currentUser?.accountId) {
            setOnlineUsers(prev => {
                const newSet = new Set([...prev]);
                newSet.delete(currentUser.accountId);
                return newSet;
            });
        }
        setUser(null);
    };

    const handleCloseNotification = async () => {
        setShowDisabledNotification(false);
        await logout();
    };

    const fetchAccountPermissions = async () => {
        try {
            const permissions = await authService.fetchAccountPermissions();
            if (permissions) {
                setUser(prev => ({ ...prev, permissions }));
            }
        } catch (error) {
            console.error('Error fetching account permissions:', error);
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout, fetchAccountPermissions, onlineUsers, connectionStatus }}>
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
