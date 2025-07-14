import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { useTheme } from '../context/ThemeContext';

const Report_Software = () => {
    const { darkMode } = useTheme();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [keepReportDropdownOpen] = useState(true);

    return (
        <div className={`fixed inset-0 flex flex-col ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
            <div className={`${isSidebarOpen ? 'backdrop-blur-sm' : ''} transition-all duration-300`}>
                <Navbar onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />
            </div>
            <Sidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
                forceOpenReportDropdown={keepReportDropdownOpen}
            />
            <main className={`flex-1 overflow-y-auto lg:pl-64 mt-16 ${darkMode ? 'custom-scrollbar-dark' : 'custom-scrollbar-light'}`}>
                <div className="p-5">
                    <div className="max-w-6xl mx-auto">
                        {/* Header */}
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">
                            <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                Software Reports
                            </h1>
                            <button
                                className="px-4 py-2 bg-[#0054A6] text-white rounded-lg hover:bg-[#004080] transition-colors w-full sm:w-auto flex items-center justify-center gap-2"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                New Report
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default Report_Software
