import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

const Leave = () => {
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
                                <div className="bg-white rounded-lg p-6 w-full max-w-md shadow border border-gray-200">
                                    <div className="flex justify-between items-center mb-4">
                                        <h2 className="text-xl font-semibold">New Leave Request</h2>
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
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Leave Type</label>
                                            <select className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0054A6] focus:border-transparent">
                                                <option>Annual Leave</option>
                                                <option>Sick Leave</option>
                                                <option>Personal Leave</option>
                                                <option>Other</option>
                                            </select>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                                                <input type="date" className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0054A6] focus:border-transparent" />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                                                <input type="date" className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0054A6] focus:border-transparent" />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Reason</label>
                                            <textarea 
                                                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0054A6] focus:border-transparent"
                                                rows="3"
                                                placeholder="Please provide a reason for your leave request"
                                            ></textarea>
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

                        {/* Leave Balance Card */}
                        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                            <h2 className="text-lg font-semibold mb-4">Remaining Days</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div className="p-4 bg-blue-50 rounded-lg">
                                    <p className="text-sm text-gray-600">Annual Leave</p>
                                    <p className="text-2xl font-bold text-[#0054A6]">12 days</p>
                                </div>
                                <div className="p-4 bg-green-50 rounded-lg">
                                    <p className="text-sm text-gray-600">Sick Leave</p>
                                    <p className="text-2xl font-bold text-green-600">7 days</p>
                                </div>
                                <div className="p-4 bg-purple-50 rounded-lg">
                                    <p className="text-sm text-gray-600">Personal Leave</p>
                                    <p className="text-2xl font-bold text-purple-600">3 days</p>
                                </div>
                            </div>
                        </div>

                        {/* Leave Requests List */}
                        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                            <div className="divide-y divide-gray-200">
                                {leaveRequests.map((request) => (
                                    <div key={request.id} className="p-6 hover:bg-gray-50 transition-colors">
                                        <div className="flex items-center justify-between mb-4">
                                            <div>
                                                <h3 className="text-lg font-medium text-gray-900">{request.type}</h3>
                                                <p className="text-sm text-gray-500">Submitted on {request.submittedAt}</p>
                                            </div>
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(request.status)}`}>
                                                {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                                            </span>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                            <div>
                                                <p className="text-gray-500">Duration</p>
                                                <p className="font-medium">{request.startDate} to {request.endDate}</p>
                                                <p className="text-gray-500 mt-1">{request.days} day(s)</p>
                                            </div>
                                            <div>
                                                <p className="text-gray-500">Reason</p>
                                                <p className="font-medium">{request.reason}</p>
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