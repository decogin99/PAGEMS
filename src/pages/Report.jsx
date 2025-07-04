import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

const Report = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedMonth, setSelectedMonth] = useState('');
    const [reportType, setReportType] = useState('all');
    const [dateRange, setDateRange] = useState({ start: '', end: '' });

    // Mock data for reports
    const reports = [
        {
            id: 1,
            reportDate: '2024-01-20',
            projectName: 'Website Redesign',
            jobType: 'Development',
            tasks: [
                'Homepage layout implementation',
                'Mobile responsiveness fixes',
                'Performance optimization'
            ],
            remark: 'All core features completed',
            status: 'finished'
        },
        {
            id: 2,
            reportDate: '2024-01-20',
            projectName: 'CRM Integration',
            jobType: 'Integration',
            tasks: [
                'API endpoint setup',
                'Data synchronization testing'
            ],
            remark: 'Pending client feedback',
            status: 'ongoing'
        },
        {
            id: 3,
            reportDate: '2024-01-15',
            projectName: 'Mobile App',
            jobType: 'Development',
            tasks: [
                'User authentication',
                'Push notifications'
            ],
            remark: 'Testing in progress',
            status: 'ongoing'
        }
    ];

    // Group reports by date
    const groupedReports = reports.reduce((groups, report) => {
        const date = report.reportDate;
        if (!groups[date]) {
            groups[date] = [];
        }
        groups[date].push(report);
        return groups;
    }, {});

    const getStatusColor = (status) => {
        return status === 'finished' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800';
    };

    return (
        <div className="fixed inset-0 flex flex-col bg-gray-50">
            <div className={`${isSidebarOpen ? 'backdrop-blur-sm' : ''} transition-all duration-300`}>
                <Navbar onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />
            </div>
            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

            <main className="flex-1 overflow-y-auto lg:pl-64 mt-16 custom-scrollbar-light">
                <div className="p-5">
                    <div className="max-w-6xl mx-auto">
                        {/* Header */}
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">
                            <h1 className="text-2xl font-bold text-gray-900">
                                Daily Reports
                            </h1>
                            <button 
                                onClick={() => setIsFormOpen(true)}
                                className="px-4 py-2 bg-[#0054A6] text-white rounded-lg hover:bg-[#004080] transition-colors w-full sm:w-auto flex items-center justify-center gap-2"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                New Report
                            </button>
                        </div>

                        {/* Filters */}
                        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                            <h2 className="text-lg font-semibold mb-4">Filters</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Month</label>
                                    <select 
                                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0054A6] focus:border-transparent"
                                        value={reportType}
                                        onChange={(e) => setReportType(e.target.value)}
                                    >
                                        <option value="all">Select Month</option>
                                        <option value="January">January</option>
                                        <option value="February">February</option>
                                        <option value="March">March</option>
                                        <option value="April">April</option>
                                        <option value="May">May</option>
                                        <option value="June">June</option>
                                        <option value="July">July</option>
                                        <option value="August">August</option>
                                        <option value="September">September</option>
                                        <option value="October">October</option>
                                        <option value="November">November</option>
                                        <option value="December">December</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Report Type</label>
                                    <select 
                                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0054A6] focus:border-transparent"
                                        value={reportType}
                                        onChange={(e) => setReportType(e.target.value)}
                                    >
                                        <option value="all">All Types</option>
                                        <option value="Development">Development</option>
                                        <option value="Integration">Integration</option>
                                        <option value="Maintenance">Maintenance</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                                    <input 
                                        type="date" 
                                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0054A6] focus:border-transparent"
                                        value={dateRange.start}
                                        onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                                    <input 
                                        type="date" 
                                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0054A6] focus:border-transparent"
                                        value={dateRange.end}
                                        onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Reports List */}
                        <div className="space-y-6">
                            {Object.entries(groupedReports).map(([date, dateReports]) => (
                                <div key={date} className="bg-white rounded-lg shadow-sm overflow-hidden">
                                    <div className="bg-[#0054A6] px-6 py-4 border-b border-gray-200">
                                        <h3 className="text-lg font-semibold text-white">
                                            {new Date(date).toLocaleDateString('en-US', {
                                                weekday: 'long',
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </h3>
                                    </div>
                                    <div className="divide-y divide-gray-200">
                                        {dateReports.map((report) => (
                                            <div key={report.id} className="p-6 hover:bg-gray-50 transition-colors">
                                                <div className="flex items-center justify-between mb-4">
                                                    <div>
                                                        <h4 className="text-lg font-medium text-gray-900">{report.projectName}</h4>
                                                        <p className="text-sm text-gray-500">{report.jobType}</p>
                                                    </div>
                                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(report.status)}`}>
                                                        {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                                                    </span>
                                                </div>
                                                <div className="space-y-4">
                                                    <div>
                                                        <h5 className="text-sm font-medium text-gray-700 mb-2">Tasks:</h5>
                                                        <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                                                            {report.tasks.map((task, index) => (
                                                                <li key={index}>{task}</li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                    <div>
                                                        <h5 className="text-sm font-medium text-gray-700 mb-1">Remarks:</h5>
                                                        <p className="text-sm text-gray-600">{report.remark}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Report;