import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

const Navbar = ({ onMenuClick }) => {
    const navigate = useNavigate();
    const { darkMode } = useTheme();
    const { user } = useAuth();
    const [imageError, setImageError] = useState(false);

    const permissions = user?.permissions || {};
    const photo = user?.employeePhoto || null;
    const employeeName = user?.employeeName || 'User';
    const departmentSection = user?.departmentSection || '';

    // Generate initials from name
    const getInitials = (name) => {
        return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    };

    return (
        <nav className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b fixed w-full z-30 shadow`}>
            <div className="lg:pl-60 transition-all duration-300">
                <div className="flex items-center justify-between h-16 px-4 sm:pl-6 lg:pl-8">
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={onMenuClick}
                            className={`p-2 rounded-md ${darkMode ? 'text-gray-400 hover:text-white hover:bg-gray-700' : 'text-gray-600 hover:text-[#0054A6] hover:bg-gray-100'} focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#0054A6]`}
                        >
                            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                        <div className="flex items-center">
                            <span className={`${darkMode ? 'text-gray-200' : 'text-gray-700'} font-semibold`}>
                                {departmentSection === 'Development' ? 'Development' : `${departmentSection} Department`}
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center">
                        <div className="flex items-center space-x-4">
                            {permissions.chatView && (
                                <div className="relative">
                                    <button
                                        onClick={() => navigate('/chat')}
                                        className={`p-2 ${darkMode ? 'text-gray-400 hover:text-white hover:bg-gray-700' : 'text-gray-600 hover:text-white hover:bg-[#0054A6]'} rounded-full`}>
                                        <svg className="h-4.5 w-4.5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z" />
                                        </svg>
                                    </button>

                                    {/* Red Dot Notification */}
                                    <span className={`absolute top-1.5 right-1.5 block h-2 md:h-2.5 w-2 md:w-2.5 rounded-full bg-red-600 ring-2 ${darkMode ? 'ring-gray-800' : 'ring-white'}`}></span>
                                </div>
                            )}

                            <button
                                className={`p-2 ${darkMode ? 'text-gray-400 hover:text-white hover:bg-gray-700' : 'text-gray-600 hover:text-white hover:bg-[#0054A6]'} rounded-full`}>
                                <svg className="h-4.5 w-4.5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                </svg>
                            </button>

                            <div className="flex items-center">
                                <button
                                    onClick={() => navigate('/profile/me')}
                                    className={`group flex items-center space-x-2 p-2 rounded-full ${darkMode ? 'md:hover:bg-gray-700' : 'md:hover:bg-[#0054A6]'}`}
                                >
                                    {photo && !imageError ? (
                                        <img
                                            src={photo}
                                            alt={employeeName}
                                            className="h-8 w-8 rounded-full object-cover me-0 sm:me-2"
                                            onError={() => setImageError(true)}
                                        />
                                    ) : (
                                        <div className="h-8 w-8 rounded-full bg-[#0054A6] flex items-center justify-center text-white text-sm font-medium 
                                        md:group-hover:bg-white md:group-hover:text-[#0054A6] 
                                        group-hover:bg-[#004080] group-hover:text-white 
                                        transition-colors me-0 sm:me-2">
                                            <span>{getInitials(employeeName)}</span>
                                        </div>
                                    )}
                                    <span className={`hidden md:block text-sm font-medium ${darkMode ? 'text-gray-300 group-hover:text-white' : 'text-gray-700 group-hover:text-white'} transition-colors pe-1`}>
                                        {employeeName}
                                    </span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;