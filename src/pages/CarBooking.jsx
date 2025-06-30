import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

const CarBooking = () => {
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
            case 'approved': return 'bg-green-100 text-green-800';
            case 'rejected': return 'bg-red-100 text-red-800';
            default: return 'bg-yellow-100 text-yellow-800';
        }
    };

    return (
        <div className="fixed inset-0 flex flex-col bg-gray-50">
            <div className={`${isSidebarOpen ? 'backdrop-blur-sm' : ''} transition-all duration-300`}>
                <Navbar onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />
            </div>
            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

            <main className="flex-1 overflow-y-auto lg:pl-64 mt-16 custom-scrollbar-light">
                <div className="p-5">
                    <div className="max-w-4xl mx-auto">
                        {/* Header */}
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">
                            <h1 className="text-2xl font-bold text-gray-900">
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
                                <div className="bg-white rounded-lg p-6 w-full max-w-md shadow border border-gray-200">
                                    <div className="flex justify-between items-center mb-4">
                                        <h2 className="text-xl font-semibold">New Car Booking</h2>
                                        <button 
                                            onClick={() => setIsFormOpen(false)}
                                            className="text-gray-500 hover:text-gray-700"
                                        >
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>
                                    <form className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Type</label>
                                            <select className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0054A6] focus:border-transparent">
                                                <option>Company Ferry</option>
                                                <option>Sedan</option>
                                                <option>Van</option>
                                                <option>Other</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Purpose</label>
                                            <input 
                                                type="text" 
                                                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0054A6] focus:border-transparent"
                                                placeholder="e.g., Client Meeting, Site Visit"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Destination</label>
                                            <input 
                                                type="text" 
                                                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0054A6] focus:border-transparent"
                                                placeholder="Enter destination"
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Start Date & Time</label>
                                                <input 
                                                    type="datetime-local" 
                                                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0054A6] focus:border-transparent" 
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">End Date & Time</label>
                                                <input 
                                                    type="datetime-local" 
                                                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0054A6] focus:border-transparent" 
                                                />
                                            </div>
                                        </div>
                                        <div className="flex justify-end space-x-3">
                                            <button
                                                type="button"
                                                onClick={() => setIsFormOpen(false)}
                                                className="px-4 py-2 border border-gray-300 rounded-lg text-white bg-red-600 hover:bg-red-700/80 transition-colors"
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
                        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                            <h2 className="text-lg font-semibold mb-4">Available Cars</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div className="p-4 bg-blue-50 rounded-lg">
                                    <p className="text-sm text-gray-600">Company Ferry</p>
                                    <p className="text-2xl font-bold text-[#0054A6]">2 Available</p>
                                </div>
                                <div className="p-4 bg-green-50 rounded-lg">
                                    <p className="text-sm text-gray-600">Sedan</p>
                                    <p className="text-2xl font-bold text-green-600">3 Available</p>
                                </div>
                                <div className="p-4 bg-purple-50 rounded-lg">
                                    <p className="text-sm text-gray-600">Van</p>
                                    <p className="text-2xl font-bold text-purple-600">1 Available</p>
                                </div>
                            </div>
                        </div>

                        {/* Booking Requests List */}
                        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                            <div className="divide-y divide-gray-200">
                                {bookingRequests.map((request) => (
                                    <div key={request.id} className="p-6 hover:bg-gray-50 transition-colors">
                                        <div className="flex items-center justify-between mb-4">
                                            <div>
                                                <h3 className="text-lg font-medium text-gray-900">{request.carType}</h3>
                                                <p className="text-sm text-gray-500">Submitted on {request.submittedAt}</p>
                                            </div>
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(request.status)}`}>
                                                {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                                            </span>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                            <div>
                                                <p className="text-gray-500">Purpose</p>
                                                <p className="font-medium">{request.purpose}</p>
                                                <p className="text-gray-500 mt-2">Destination</p>
                                                <p className="font-medium">{request.destination}</p>
                                            </div>
                                            <div>
                                                <p className="text-gray-500">Duration</p>
                                                <p className="font-medium">{request.startDateTime}</p>
                                                <p className="font-medium">to</p>
                                                <p className="font-medium">{request.endDateTime}</p>
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