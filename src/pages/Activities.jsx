import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import ActivityPostForm from '../components/Activity/ActivityPostForm';
import ActivityCard from '../components/Activity/ActivityCard';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import activityService from '../services/activityService';

const Activities = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [showNewPostForm, setShowNewPostForm] = useState(false);
    const { darkMode } = useTheme();
    const { user } = useAuth();

    // State for activities
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    // Check if user has Full Control permission for activities
    const hasFullControl = user?.permissions?.activityViewControl === 'Full Control';

    // Function to fetch activities
    const fetchActivities = async (page = 1) => {
        setLoading(true);
        setError(null);

        try {
            const response = await activityService.getActivityList(page);

            if (response.success) {
                setActivities(response.data.data || []);
                setTotalPages(response.data.totalPages || 1);
                setCurrentPage(page);
            } else {
                setError(response.message || 'Failed to fetch activities');
                setActivities([]);
            }
        } catch (err) {
            console.error('Error fetching activities:', err);
            setError('An unexpected error occurred while fetching activities');
            setActivities([]);
        } finally {
            setLoading(false);
        }
    };

    // Fetch activities on component mount
    useEffect(() => {
        fetchActivities(1);
    }, []);

    const handleSubmitPost = (postData) => {
        // The postData will contain the response from the API
        console.log('New post created:', postData);

        // Close the form
        setShowNewPostForm(false);

        // Refresh the activities list to show the new post
        fetchActivities(1);
    };

    // Function to handle pagination
    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            fetchActivities(newPage);
        }
    };

    return (
        <div className={`fixed inset-0 flex flex-col ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
            <div className={`${isSidebarOpen ? 'backdrop-blur-sm' : ''} transition-all duration-300`}>
                <Navbar onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />
            </div>
            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

            {/* Activity Post Form Modal */}
            <ActivityPostForm
                isOpen={showNewPostForm}
                onClose={() => setShowNewPostForm(false)}
                onSubmit={handleSubmitPost}
            />

            <main className={`flex-1 overflow-y-auto lg:pl-64 mt-16 ${darkMode ? 'custom-scrollbar-dark' : 'custom-scrollbar-light'}`}>
                <div className="p-5">
                    <div className="max-w-2xl mx-auto"> {/* Reduced max-width for Instagram-like feed */}
                        <div className="flex items-center justify-between mb-5">
                            <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                Activities
                            </h1>
                            {/* Only show New Post button if user has Full Control permission */}
                            {hasFullControl && (
                                <button
                                    onClick={() => setShowNewPostForm(true)}
                                    className="px-4 py-2 bg-[#0054A6] text-white rounded-lg hover:bg-[#004080] transition-colors flex items-center gap-2"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                    New Post
                                </button>
                            )}
                        </div>

                        {/* Error message */}
                        {error && (
                            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                                <p>{error}</p>
                            </div>
                        )}

                        {/* Loading state */}
                        {loading ? (
                            <div className={`flex justify-center items-center ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                                <svg className="animate-spin h-8 w-8 mr-3" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                <span>Loading activities...</span>
                            </div>
                        ) : (
                            <>
                                {/* Activities list */}
                                {activities.length > 0 ? (
                                    <div className="space-y-6">
                                        {activities.map((activity) => (
                                            <ActivityCard key={activity.activityId} activity={activity} />
                                        ))}
                                    </div>
                                ) : (
                                    <div className={`text-center ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                                        <p>No activities found!</p>
                                    </div>
                                )}

                                {/* Pagination */}
                                {totalPages > 1 && (
                                    <div className="flex justify-center mt-6 space-x-2">
                                        <button
                                            onClick={() => handlePageChange(currentPage - 1)}
                                            disabled={currentPage === 1}
                                            className={`px-3 py-1 rounded ${currentPage === 1 ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-[#0054A6] text-white hover:bg-[#004080]'}`}
                                        >
                                            Previous
                                        </button>
                                        <span className={`px-3 py-1 ${darkMode ? 'text-white' : 'text-gray-700'}`}>
                                            Page {currentPage} of {totalPages}
                                        </span>
                                        <button
                                            onClick={() => handlePageChange(currentPage + 1)}
                                            disabled={currentPage === totalPages}
                                            className={`px-3 py-1 rounded ${currentPage === totalPages ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-[#0054A6] text-white hover:bg-[#004080]'}`}
                                        >
                                            Next
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Activities;