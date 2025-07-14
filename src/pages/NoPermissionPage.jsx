import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { useTheme } from '../context/ThemeContext';

const NoPermissionPage = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const { darkMode } = useTheme();

    return (
        <div className={`fixed inset-0 flex flex-col ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
            <div className={`${isSidebarOpen ? 'backdrop-blur-sm' : ''} transition-all duration-300`}>
                <Navbar onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />
            </div>
            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

            <main className={`flex-1 overflow-y-auto lg:pl-64 mt-16 ${darkMode ? 'custom-scrollbar-dark' : 'custom-scrollbar-light'}`}>
                <div className="p-5">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex items-center justify-center">
                            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} pt-2 max-w-md text-center`}>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-red-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                                <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'} mb-2`}>No Permission</h1>
                                <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-1`}>You don't have permission to access this page.</p>
                                <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Contact your administrator to request access!</p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default NoPermissionPage;