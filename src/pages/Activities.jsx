import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import ActivityPostForm from '../components/Activity/ActivityPostForm';
import ActivityEditForm from '../components/Activity/ActivityEditForm';
import ActivityCard from '../components/Activity/ActivityCard';
import CommentSection from '../components/Activity/CommentSection';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import activityService from '../services/activityService';
import signalRService from '../services/signalRService';

const Activities = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [showNewPostForm, setShowNewPostForm] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);
    const [selectedActivity, setSelectedActivity] = useState(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [activityToDelete, setActivityToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const { darkMode } = useTheme();
    const { user } = useAuth();

    // State for activities
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [openCommentSections, setOpenCommentSections] = useState({});

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

    // Set up SignalR connection and event handlers
    useEffect(() => {
        // Initialize SignalR connection for ActivityAdded
        const unsubscribeAdded = signalRService.on('ActivityAdded', () => {
            // Refresh activities when a new activity is added
            fetchActivities(currentPage);
        });

        // Initialize SignalR connection for ActivityUpdated
        const unsubscribeUpdated = signalRService.on('ActivityUpdated', () => {
            // Refresh activities when an activity is updated
            fetchActivities(currentPage);
        });

        // Initialize SignalR connection for ActivityLiked
        const unsubscribeLiked = signalRService.on('ActivityLiked', (likedActivity) => {
            // Update only the affected activity instead of refreshing the entire list
            setActivities(prevActivities => {
                const updatedActivities = prevActivities.map(activity => {
                    if (activity.activityId === likedActivity.activityId) {
                        // Check if the current user is the one who liked the activity
                        const isCurrentUserAction = String(likedActivity.likedByUserId) === String(user.accountId);

                        // Only update isLikedByCurrentUser if the current user performed the action
                        // Otherwise, keep the existing value
                        return {
                            ...activity,
                            likeCount: likedActivity.likeCount,
                            isLikedByCurrentUser: isCurrentUserAction ? true : activity.isLikedByCurrentUser,
                            // Preserve the existing comment count
                            commentCount: activity.commentCount
                        };
                    }
                    return activity;
                });
                return updatedActivities;
            });
        });

        // Initialize SignalR connection for ActivityUnliked
        const unsubscribeUnliked = signalRService.on('ActivityUnliked', (unlikedActivity) => {
            setActivities(prevActivities => {
                const updatedActivities = prevActivities.map(activity => {
                    if (activity.activityId === unlikedActivity.activityId) {
                        // Check if the current user is the one who unliked the activity
                        const isCurrentUserAction = String(unlikedActivity.likedByUserId) === String(user.accountId);

                        return {
                            ...activity,
                            likeCount: unlikedActivity.likeCount,
                            isLikedByCurrentUser: isCurrentUserAction ? false : activity.isLikedByCurrentUser,
                            // Preserve the existing comment count
                            commentCount: activity.commentCount
                        };
                    }
                    return activity;
                });
                return updatedActivities;
            });
        });

        // Initialize SignalR connection for ActivityDeleted
        const unsubscribeDeleted = signalRService.on('ActivityDeleted', (deletedActivity) => {
            // Remove the deleted activity from the list
            setActivities(prevActivities => {
                return prevActivities.filter(activity => activity.activityId !== deletedActivity.activityId);
            });

            // Show a notification if needed
            // You could add a toast notification here if you have a notification system
        });

        // Initialize SignalR connection for CommentAdded
        const unsubscribeCommentAdded = signalRService.on('ActivityCommented', (commentData) => {
            // Update the activity with the new comment count
            setActivities(prevActivities => {
                return prevActivities.map(activity => {
                    if (activity.activityId === commentData.activityId) {
                        return {
                            ...activity,
                            commentCount: commentData.commentCount
                        };
                    }
                    return activity;
                });
            });
        });

        // Initialize SignalR connection for CommentDeleted
        const unsubscribeCommentDeleted = signalRService.on('CommentDeleted', (commentData) => {

            // Update the activity with the new comment count
            setActivities(prevActivities => {
                return prevActivities.map(activity => {
                    if (activity.activityId === commentData.activityId) {
                        return {
                            ...activity,
                            commentCount: commentData.commentCount
                        };
                    }
                    return activity;
                });
            });
        });

        // Clean up SignalR connections when component unmounts
        return () => {
            unsubscribeAdded();
            unsubscribeUpdated();
            unsubscribeLiked();
            unsubscribeUnliked();
            unsubscribeDeleted();
            unsubscribeCommentAdded();
            unsubscribeCommentDeleted();
        };
    }, [currentPage]); // Re-subscribe when currentPage changes

    // Fetch activities on component mount
    useEffect(() => {
        fetchActivities(1);
    }, []);

    const handleToggleComments = (activityId) => {
        setOpenCommentSections(prev => ({
            ...prev,
            [activityId]: !prev[activityId]
        }));
    };

    const handleSubmitPost = (postData) => {
        // The postData will contain the response from the API
        console.log('New post created:', postData);

        // Close the form
        setShowNewPostForm(false);

        // Refresh the activities list to show the new post
        fetchActivities(1);
    };

    const handleEditActivity = (activity) => {
        setSelectedActivity(activity);
        setShowEditForm(true);
    };

    const handleUpdateActivity = () => {
        setShowEditForm(false);
        setSelectedActivity(null);
        fetchActivities(currentPage);
    };

    const handleDeleteClick = (activityId) => {
        setActivityToDelete(activityId);
        setShowDeleteConfirm(true);
    };

    const confirmDelete = async () => {
        if (!activityToDelete) return;

        setIsDeleting(true);
        try {
            const response = await activityService.deleteActivity(activityToDelete);
            if (!response.success) {
                setError(response.message || 'Failed to delete activity');
            }
            // No need to call fetchActivities here as the SignalR event will handle it
        } catch (err) {
            console.error('Error deleting activity:', err);
            setError('An unexpected error occurred while deleting the activity');
        } finally {
            setIsDeleting(false);
            setShowDeleteConfirm(false);
            setActivityToDelete(null);
        }
    };

    const cancelDelete = () => {
        setShowDeleteConfirm(false);
        setActivityToDelete(null);
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

            {/* Activity Edit Form Modal */}
            {selectedActivity && (
                <ActivityEditForm
                    isOpen={showEditForm}
                    onClose={() => {
                        setShowEditForm(false);
                        setSelectedActivity(null);
                    }}
                    onSubmit={handleUpdateActivity}
                    activity={selectedActivity}
                />
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                    <div className="flex items-center justify-center min-h-screen p-4 text-center">
                        <div className="fixed inset-0 backdrop-blur-sm bg-opacity-75 transition-opacity" aria-hidden="true"></div>
                        <div className={`relative inline-block align-middle ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:max-w-lg w-full p-6`}>
                            <div className="text-center">
                                <h3 className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>Confirm Delete</h3>
                                <p className={`${darkMode ? 'text-gray-300' : 'text-gray-500'} mb-6`}>Are you sure you want to delete this activity? This action cannot be undone.</p>
                                <div className="flex justify-center space-x-4">
                                    <button
                                        onClick={cancelDelete}
                                        className={`px-4 py-2 rounded-lg ${darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                                        disabled={isDeleting}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={confirmDelete}
                                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center min-w-[100px]"
                                        disabled={isDeleting}
                                    >
                                        {isDeleting ? (
                                            <>
                                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Deleting...
                                            </>
                                        ) : (
                                            'Delete'
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

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
                                            <div key={`${activity.activityId}-${activity.likeCount}-${activity.isLikedByCurrentUser}`}>
                                                <ActivityCard
                                                    activity={activity}
                                                    onEdit={handleEditActivity}
                                                    onDelete={handleDeleteClick}
                                                    onToggleComments={handleToggleComments}
                                                    showComments={!!openCommentSections[activity.activityId]}
                                                />
                                                {/* Render CommentSection outside of ActivityCard */}
                                                {openCommentSections[activity.activityId] && (
                                                    <CommentSection
                                                        activityId={activity.activityId}
                                                        initialCommentCount={activity.commentCount || 0}
                                                        showComments={true}
                                                        setShowComments={(show) => {
                                                            if (!show) {
                                                                setOpenCommentSections(prev => ({
                                                                    ...prev,
                                                                    [activity.activityId]: false
                                                                }));
                                                            }
                                                        }}
                                                    />
                                                )}
                                            </div>
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
