import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

const Announcements = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Mock data for announcements
    const announcements = [
        {
            id: 1,
            title: 'Company Policy Update',
            date: '2024-01-15',
            type: 'pdf',
            description: 'New guidelines for remote work policy',
            fileUrl: '#'
        },
        {
            id: 2,
            title: 'Monthly Newsletter',
            date: '2024-01-10',
            type: 'word',
            description: 'January 2024 company updates and achievements',
            fileUrl: '#'
        },
        {
            id: 3,
            title: 'Holiday Schedule',
            date: '2024-01-05',
            type: 'text',
            description: 'Updated holiday calendar for 2024',
            fileUrl: '#'
        },
        {
            id: 4,
            title: 'CarBooking Announcement',
            date: '2024-01-05',
            type: 'pdf',
            description: 'Updated carbooking changes',
            fileUrl: '#'
        }
    ];

    const getFileIcon = (type) => {
        switch (type) {
            case 'pdf':
                return (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                );
            case 'word':
                return (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                );
            default:
                return (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                );
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
                    <div className="max-w-7xl mx-auto">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">
                            <h1 className="text-2xl font-bold text-gray-900">
                                Announcements
                            </h1>
                            <div className="flex items-center space-x-4">
                                <button className="px-4 py-2 bg-[#0054A6] text-white rounded-lg hover:bg-[#004080] transition-colors w-full sm:w-auto flex items-center justify-center gap-2">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                    New Announcement
                                </button>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm">
                            {announcements.map((announcement) => (
                                <div key={announcement.id} className="p-6 border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors">
                                    <div className="flex items-start gap-4">
                                        <div className="bg-[#0054A6]/10 p-3 rounded-lg">
                                            {getFileIcon(announcement.type)}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between">
                                                <h3 className="text-lg font-semibold text-gray-900">
                                                    {announcement.title}
                                                </h3>
                                                <span className="text-sm text-gray-500">
                                                    {announcement.date}
                                                </span>
                                            </div>
                                            <p className="mt-1 text-gray-600">
                                                {announcement.description}
                                            </p>
                                            <div className="mt-4 flex items-center gap-4">
                                                <a 
                                                    href={announcement.fileUrl}
                                                    className="text-sm text-[#0054A6] hover:text-[#004080] font-medium flex items-center gap-2"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                                    </svg>
                                                    Download {announcement.type.toUpperCase()}
                                                </a>
                                            </div>
                                        </div>
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

export default Announcements;