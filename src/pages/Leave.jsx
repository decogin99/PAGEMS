import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { useTheme } from '../context/ThemeContext';

const Leave = () => {
    const { darkMode } = useTheme();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isFormOpen, setIsFormOpen] = useState(false);

    // Mock data for leave requests
    const leaveRequests = [
        {
            id: 1,
            type: 'Annual Leave',
            startDate: '2024-01-20',
            endDate: '2024-01-22',
            days: 3,
            reason: 'Family vacation',
            status: 'pending',
            submittedAt: '2024-01-15'
        },
        {
            id: 2,
            type: 'Sick Leave',
            startDate: '2024-01-10',
            endDate: '2024-01-10',
            days: 1,
            reason: 'Doctor appointment',
            status: 'approved',
            submittedAt: '2024-01-08'
        },
        {
            id: 3,
            type: 'Personal Leave',
            startDate: '2024-01-05',
            endDate: '2024-01-05',
            days: 1,
            reason: 'Family matter',
            status: 'rejected',
            submittedAt: '2024-01-03'
        }
    ];

    const getStatusColor = (status) => {
        switch (status) {
            case 'approved': return darkMode ? 'bg-green-900 text-green-100' : 'bg-green-100 text-green-800';
            case 'rejected': return darkMode ? 'bg-red-900 text-red-100' : 'bg-red-100 text-red-800';
            default: return darkMode ? 'bg-yellow-900 text-yellow-100' : 'bg-yellow-100 text-yellow-800';
        }
    };

    return (
        <div className={`fixed inset-0 flex flex-col ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
            <div className={`${isSidebarOpen ? 'backdrop-blur-sm' : ''} transition-all duration-300`}>
                <Navbar onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />
            </div>
            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

            <main className={`flex-1 overflow-y-auto lg:pl-64 mt-16 ${darkMode ? 'custom-scrollbar-dark' : 'custom-scrollbar-light'}`}>
                <div className="p-5">
                    <div className="max-w-7xl mx-auto">
                        {/* Header */}
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">
                            <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                Leave Requests
                            </h1>
                            <button
                                onClick={() => setIsFormOpen(true)}
                                className="px-4 py-2 bg-[#0054A6] text-white rounded-lg hover:bg-[#004080] transition-colors w-full sm:w-auto flex items-center justify-center gap-2"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                New Request
                            </button>
                        </div>

                        {/* Leave Request Form Modal */}
                        {isFormOpen && (
                            <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 px-4 sm:px-0">
                                <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg p-6 w-full max-w-md shadow border`}>
                                    <div className="flex justify-between items-center mb-4">
                                        <h2 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>New Leave Request</h2>
                                        <button
                                            onClick={() => setIsFormOpen(false)}
                                            className={`${darkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'}`}
                                        >
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>
                                    <form className="space-y-4">
                                        <div>
                                            <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>Leave Type</label>
                                            <select className={`w-full h-10 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0054A6] focus:border-transparent ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}>
                                                <option>Annual Leave</option>
                                                <option>Sick Leave</option>
                                                <option>Personal Leave</option>
                                                <option>Other</option>
                                            </select>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>Start Date</label>
                                                <input
                                                    type="date" className={`w-full h-10 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0054A6] focus:border-transparent ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                                                    style={{ minWidth: '90%' }} />
                                            </div>
                                            <div>
                                                <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>End Date</label>
                                                <input
                                                    type="date" className={`w-full h-10 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0054A6] focus:border-transparent ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                                                    style={{ minWidth: '90%' }} />
                                            </div>
                                        </div>
                                        <div>
                                            <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>Reason</label>
                                            <textarea
                                                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0054A6] focus:border-transparent ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                                                rows="3"
                                                placeholder="Please provide a reason for your leave request"
                                            ></textarea>
                                        </div>
                                        <div className="flex justify-end space-x-3">
                                            <button
                                                type="button"
                                                onClick={() => setIsFormOpen(false)}
                                                className="px-4 py-2 rounded-lg text-white bg-red-600 hover:bg-red-700/80 transition-colors"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="submit"
                                                className="px-4 py-2 bg-[#0054A6] text-white rounded-lg hover:bg-[#004080] transition-colors"
                                            >
                                                Submit Request
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        )}

                        {/* Leave Balance Card */}
                        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-sm p-6 mb-6`}>
                            <h2 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Remaining Days</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div className={`p-4 ${darkMode ? 'bg-blue-900/30' : 'bg-blue-50'} rounded-lg`}>
                                    <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Annual Leave</p>
                                    <p className="text-2xl font-bold text-[#0054A6]">12 days</p>
                                </div>
                                <div className={`p-4 ${darkMode ? 'bg-green-900/30' : 'bg-green-50'} rounded-lg`}>
                                    <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Sick Leave</p>
                                    <p className={`text-2xl font-bold ${darkMode ? 'text-green-400' : 'text-green-600'}`}>7 days</p>
                                </div>
                                <div className={`p-4 ${darkMode ? 'bg-purple-900/30' : 'bg-purple-50'} rounded-lg`}>
                                    <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Personal Leave</p>
                                    <p className={`text-2xl font-bold ${darkMode ? 'text-purple-400' : 'text-purple-600'}`}>3 days</p>
                                </div>
                            </div>
                        </div>

                        {/* Leave Requests List */}
                        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-sm overflow-hidden`}>
                            <div className={`divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
                                {leaveRequests.map((request) => (
                                    <div key={request.id} className={`p-6 ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} transition-colors`}>
                                        <div className="flex items-center justify-between mb-4">
                                            <div>
                                                <h3 className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{request.type}</h3>
                                                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Submitted on {request.submittedAt}</p>
                                            </div>
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(request.status)}`}>
                                                {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                                            </span>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                            <div>
                                                <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Duration</p>
                                                <p className={`font-medium ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>{request.startDate} to {request.endDate}</p>
                                                <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} mt-1`}>{request.days} day(s)</p>
                                            </div>
                                            <div>
                                                <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Reason</p>
                                                <p className={`font-medium ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>{request.reason}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Leave;