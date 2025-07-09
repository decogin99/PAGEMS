import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { useTheme } from '../context/ThemeContext';

const CarBooking = () => {
    const { darkMode } = useTheme();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isFormOpen, setIsFormOpen] = useState(false);

    // Mock data for car booking requests
    const bookingRequests = [
        {
            id: 1,
            carType: 'Company Ferry',
            purpose: 'Client Meeting',
            destination: 'Downtown Office',
            startDateTime: '2024-01-20 09:00',
            endDateTime: '2024-01-20 17:00',
            status: 'pending',
            submittedAt: '2024-01-15'
        },
        {
            id: 2,
            carType: 'Sedan',
            purpose: 'Marketing Event',
            destination: 'Convention Center',
            startDateTime: '2024-01-18 13:00',
            endDateTime: '2024-01-18 18:00',
            status: 'approved',
            submittedAt: '2024-01-10'
        },
        {
            id: 3,
            carType: 'Van',
            purpose: 'Site Visit',
            destination: 'Industrial Park',
            startDateTime: '2024-01-15 10:00',
            endDateTime: '2024-01-15 15:00',
            status: 'rejected',
            submittedAt: '2024-01-08'
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
                                Car Booking
                            </h1>
                            <button
                                onClick={() => setIsFormOpen(true)}
                                className="px-4 py-2 bg-[#0054A6] text-white rounded-lg hover:bg-[#004080] transition-colors w-full sm:w-auto flex items-center justify-center gap-2"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                New Booking
                            </button>
                        </div>

                        {/* Car Booking Form Modal */}
                        {isFormOpen && (
                            <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 px-4 sm:px-0">
                                <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg p-6 w-full max-w-md shadow border`}>
                                    <div className="flex justify-between items-center mb-4">
                                        <h2 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>New Car Booking</h2>
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
                                            <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>Vehicle Type</label>
                                            <select className={`w-full h-10 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0054A6] focus:border-transparent ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}>
                                                <option>Company Ferry</option>
                                                <option>Sedan</option>
                                                <option>Van</option>
                                                <option>Other</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>Purpose</label>
                                            <input
                                                type="text"
                                                className={`w-full h-10 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0054A6] focus:border-transparent ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                                                placeholder="e.g., Client Meeting, Site Visit"
                                            />
                                        </div>
                                        <div>
                                            <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>Destination</label>
                                            <input
                                                type="text"
                                                className={`w-full h-10 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0054A6] focus:border-transparent ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                                                placeholder="Enter destination"
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>Start Date & Time</label>
                                                <input
                                                    type="datetime-local"
                                                    className={`w-full h-10 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0054A6] focus:border-transparent ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                                                />
                                            </div>
                                            <div>
                                                <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>End Date & Time</label>
                                                <input
                                                    type="datetime-local"
                                                    className={`w-full h-10 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0054A6] focus:border-transparent ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                                                />
                                            </div>
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

                        {/* Available Vehicles */}
                        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-sm p-6 mb-6`}>
                            <h2 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Available Cars</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div className={`p-4 ${darkMode ? 'bg-blue-900/30' : 'bg-blue-50'} rounded-lg`}>
                                    <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Company Ferry</p>
                                    <p className="text-2xl font-bold text-[#0054A6]">2 Available</p>
                                </div>
                                <div className={`p-4 ${darkMode ? 'bg-green-900/30' : 'bg-green-50'} rounded-lg`}>
                                    <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Sedan</p>
                                    <p className={`text-2xl font-bold ${darkMode ? 'text-green-400' : 'text-green-600'}`}>3 Available</p>
                                </div>
                                <div className={`p-4 ${darkMode ? 'bg-purple-900/30' : 'bg-purple-50'} rounded-lg`}>
                                    <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Van</p>
                                    <p className={`text-2xl font-bold ${darkMode ? 'text-purple-400' : 'text-purple-600'}`}>1 Available</p>
                                </div>
                            </div>
                        </div>

                        {/* Booking Requests List */}
                        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-sm overflow-hidden`}>
                            <div className={`divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
                                {bookingRequests.map((request) => (
                                    <div key={request.id} className={`p-6 ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} transition-colors`}>
                                        <div className="flex items-center justify-between mb-4">
                                            <div>
                                                <h3 className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{request.carType}</h3>
                                                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Submitted on {request.submittedAt}</p>
                                            </div>
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(request.status)}`}>
                                                {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                                            </span>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                            <div>
                                                <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Purpose</p>
                                                <p className={`font-medium ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>{request.purpose}</p>
                                                <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} mt-2`}>Destination</p>
                                                <p className={`font-medium ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>{request.destination}</p>
                                            </div>
                                            <div>
                                                <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Duration</p>
                                                <p className={`font-medium ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>{request.startDateTime}</p>
                                                <p className={`font-medium ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>to</p>
                                                <p className={`font-medium ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>{request.endDateTime}</p>
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

export default CarBooking;