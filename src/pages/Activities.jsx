import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

const Activities = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Mock data for activities
    const activities = [
        {
            id: 1,
            title: 'Annual Company Dinner 2024',
            date: '2024-01-15',
            description: 'Celebrating our achievements and strengthening bonds at the annual company dinner.',
            author: 'Admin',
            authorAvatar: '/admin-avatar.jpg',
            likes: 24,
            comments: 5,
            images: [
                '/dinner1.jpg',
                '/dinner2.jpg',
                '/dinner3.jpg'
            ]
        },
        {
            id: 2,
            title: 'Corporate Social Responsibility Event',
            date: '2024-01-10',
            description: 'Team building activity at local community center helping to renovate facilities.',
            author: 'Admin',
            authorAvatar: '/admin-avatar.jpg',
            likes: 18,
            comments: 3,
            images: [
                '/csr1.jpg',
                '/csr2.jpg'
            ]
        },
        {
            id: 3,
            title: 'New Office Opening Ceremony',
            date: '2024-01-05',
            description: 'Grand opening of our new branch office with special guests and team members.',
            author: 'Admin',
            authorAvatar: '/admin-avatar.jpg',
            likes: 32,
            comments: 7,
            images: [
                '/office1.jpg'
            ]
        }
    ];

    return (
        <div className="fixed inset-0 flex flex-col bg-gray-50">
            <div className={`${isSidebarOpen ? 'backdrop-blur-sm' : ''} transition-all duration-300`}>
                <Navbar onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />
            </div>
            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

            <main className="flex-1 overflow-y-auto lg:pl-64 mt-16 custom-scrollbar-light">
                <div className="p-5">
                    <div className="max-w-2xl mx-auto"> {/* Reduced max-width for Instagram-like feed */}
                        <div className="flex items-center justify-between mb-5">
                            <h1 className="text-2xl font-bold text-gray-900">
                                Activities
                            </h1>
                            <button className="px-4 py-2 bg-[#0054A6] text-white rounded-lg hover:bg-[#004080] transition-colors flex items-center gap-2">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                New Post
                            </button>
                        </div>

                        <div className="space-y-6">
                            {activities.map((activity) => (
                                <div key={activity.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                                    {/* Post Header */}
                                    <div className="p-4 flex items-center justify-between">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden">
                                                <img 
                                                    src={activity.authorAvatar} 
                                                    alt={activity.author}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div>
                                                <p className="font-medium text-sm">{activity.author}</p>
                                                <p className="text-xs text-gray-500">{activity.date}</p>
                                            </div>
                                        </div>
                                        <button className="text-gray-500 hover:text-gray-700">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                                            </svg>
                                        </button>
                                    </div>

                                    {/* Images */}
                                    <div className="relative aspect-square bg-black">
                                        {activity.images.length > 0 && (
                                            <img 
                                                src={activity.images[0]}
                                                alt={activity.title}
                                                className="w-full h-full object-contain"
                                            />
                                        )}
                                        {activity.images.length > 1 && (
                                            <div className="absolute top-4 right-4 bg-black/50 text-white px-2 py-1 rounded-full text-xs">
                                                {activity.images.length} photos
                                            </div>
                                        )}
                                    </div>

                                    {/* Caption */}
                                    <div className="px-4 pt-4">
                                        <p className="text-sm">
                                            <span className="font-medium">{activity.author}</span>
                                            {' '}{activity.description}
                                        </p>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="px-4 pt-2 pb-4">
                                        <div className="flex items-center space-x-4">
                                            <button className="text-gray-500 hover:text-red-500 transition-colors">
                                                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                                </svg>
                                            </button>
                                            <button className="text-gray-500 hover:text-gray-700 transition-colors">
                                                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                                </svg>
                                            </button>
                                        </div>
                                        <div className="mt-2">
                                            <p className="text-sm font-medium">{activity.likes} likes</p>
                                            <p className="text-xs text-gray-500 mt-1">
                                                {activity.comments} comments
                                            </p>
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

export default Activities;