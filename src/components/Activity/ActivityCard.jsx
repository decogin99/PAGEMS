import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import activityService from '../../services/activityService';
import CommentSection from './CommentSection';

const IMG_BASE_URL = import.meta.env.VITE_IMG_URL;

const ActivityCard = ({
    activities,
    loading,
    error,
    handleEdit,
    handleDelete,
    handleToggleComments,
    openCommentSections,
    loadMoreActivities,
    currentPage,
    totalPages
}) => {
    const { darkMode } = useTheme();
    // Move the state outside of the map function
    const [imageIndices, setImageIndices] = useState({});

    const handleLikeToggle = async (activityId, isLikedByCurrentUser) => {
        try {
            if (isLikedByCurrentUser) {
                await activityService.unlikeActivity(activityId);
            } else {
                await activityService.likeActivity(activityId);
            }
            // No need to update state here as SignalR will handle it
        } catch (error) {
            console.error('Error toggling like:', error);
        }
    };

    // Add a function to update the image index for a specific activity
    const updateImageIndex = (activityId, index) => {
        setImageIndices(prev => ({
            ...prev,
            [activityId]: index
        }));
    };

    return (
        <>
            {error ? (
                <div className={`p-4 rounded-lg ${darkMode ? 'bg-red-900 text-white' : 'bg-red-100 text-red-700'}`}>
                    {error}
                </div>
            ) : loading && activities.length === 0 ? (
                <div className="flex justify-center items-center p-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0054A6]"></div>
                </div>
            ) : (
                <>
                    {activities.length > 0 ? (
                        <div className="space-y-4">
                            {activities.map((activity) => {
                                const hasLiked = activity.isLikedByCurrentUser;
                                const localLikeCount = activity.likeCount || 0;
                                const showComments = openCommentSections[activity.activityId] || false;
                                const hasImages = activity.activityDetail && activity.activityDetail.length > 0;
                                const totalImages = hasImages ? activity.activityDetail.length : 0;
                                // Use the imageIndices state instead of a local state
                                const currentImageIndex = imageIndices[activity.activityId] || 0;

                                return (
                                    <div key={activity.activityId} className={`rounded-lg shadow-md overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                                        <div>
                                            {/* Post Header */}
                                            <div className="flex items-center justify-between px-4 py-3">
                                                <div className="flex items-center space-x-3">
                                                    <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center">
                                                        {/* Default avatar icon if no image */}
                                                        <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                                        </svg>
                                                    </div>
                                                    <div>
                                                        <p className={`font-medium text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>{activity.createdByName || 'Admin'}</p>
                                                        <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                                            {new Date(activity.createdDate).toLocaleDateString("en-US", {
                                                                year: "numeric",
                                                                month: "short",
                                                                day: "2-digit"
                                                            })}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Options Dropdown (only show if user has control permission) */}
                                                {activity.controlAction && (
                                                    <div className="relative">
                                                        <button
                                                            className={`${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-500 hover:text-gray-700'}`}
                                                            onClick={() => {
                                                                const dropdown = document.getElementById(`dropdown-${activity.activityId}`);
                                                                dropdown.classList.toggle('hidden');
                                                            }}
                                                        >
                                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                                                            </svg>
                                                        </button>
                                                        <div
                                                            id={`dropdown-${activity.activityId}`}
                                                            className={`absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 hidden z-10 ${darkMode ? 'bg-gray-700' : 'bg-white'} ring-1 ring-black ring-opacity-5`}
                                                        >
                                                            <button
                                                                onClick={() => {
                                                                    document.getElementById(`dropdown-${activity.activityId}`).classList.add('hidden');
                                                                    handleEdit(activity);
                                                                }}
                                                                className={`block px-4 py-2 text-sm w-full text-left ${darkMode ? 'text-gray-300 hover:bg-gray-600' : 'text-gray-700 hover:bg-gray-100'}`}
                                                            >
                                                                Edit
                                                            </button>
                                                            <button
                                                                onClick={() => {
                                                                    document.getElementById(`dropdown-${activity.activityId}`).classList.add('hidden');
                                                                    handleDelete(activity.activityId);
                                                                }}
                                                                className={`block px-4 py-2 text-sm w-full text-left ${darkMode ? 'text-red-400 hover:bg-gray-600' : 'text-red-600 hover:bg-gray-100'}`}
                                                            >
                                                                Delete
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Image Carousel */}
                                            <div className="relative aspect-square bg-black">
                                                {totalImages > 0 ? (
                                                    <>
                                                        <img
                                                            src={`${IMG_BASE_URL}/activity/${activity.activityDetail[currentImageIndex].image}`}
                                                            alt={`${activity.activityName} - Image ${currentImageIndex + 1}`}
                                                            className="w-full h-full object-contain"
                                                        />

                                                        {/* Navigation arrows (only show if there are multiple images) */}
                                                        {totalImages > 1 && (
                                                            <>
                                                                {/* Left arrow */}
                                                                <button
                                                                    onClick={() => updateImageIndex(activity.activityId, currentImageIndex === 0 ? totalImages - 1 : currentImageIndex - 1)}
                                                                    className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 rounded-full p-1 text-white hover:bg-opacity-75 transition-all"
                                                                    aria-label="Previous image"
                                                                >
                                                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                                                    </svg>
                                                                </button>

                                                                {/* Right arrow */}
                                                                <button
                                                                    onClick={() => updateImageIndex(activity.activityId, currentImageIndex === totalImages - 1 ? 0 : currentImageIndex + 1)}
                                                                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 rounded-full p-1 text-white hover:bg-opacity-75 transition-all"
                                                                    aria-label="Next image"
                                                                >
                                                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                                    </svg>
                                                                </button>

                                                                {/* Image counter indicator */}
                                                                <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1">
                                                                    {Array.from({ length: totalImages }).map((_, index) => (
                                                                        <button
                                                                            key={index}
                                                                            onClick={() => updateImageIndex(activity.activityId, index)}
                                                                            className={`w-2 h-2 rounded-full ${currentImageIndex === index ? 'bg-white' : 'bg-white/50'}`}
                                                                            aria-label={`Go to image ${index + 1}`}
                                                                        />
                                                                    ))}
                                                                </div>
                                                            </>
                                                        )}
                                                    </>
                                                )
                                                    : (
                                                        <div>no image</div>
                                                    )}
                                            </div>

                                            {/* Caption */}
                                            <div className="px-4 pt-4">
                                                <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                                                    {' '}{activity.activityName}
                                                </p>
                                            </div>

                                            {/* Action Buttons */}
                                            <div className="flex px-4 pb-4 pt-2 space-x-5">
                                                <div className="flex items-center space-x-2">
                                                    <button
                                                        onClick={() => handleLikeToggle(activity.activityId, hasLiked)}
                                                        className={`transition-colors ${hasLiked
                                                            ? (darkMode ? 'text-red-400' : 'text-red-500')
                                                            : (darkMode ? 'text-gray-400 hover:text-red-400' : 'text-gray-500 hover:text-red-500')}`}
                                                    >
                                                        {hasLiked ? (
                                                            <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                                                                <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                                            </svg>
                                                        ) : (
                                                            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                                            </svg>
                                                        )}
                                                    </button>
                                                    <p className={`text-sm font-bold ${darkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'}`}>{localLikeCount} likes</p>
                                                </div>
                                                <div className='flex items-center space-x-2'>
                                                    <button
                                                        onClick={() => handleToggleComments(activity.activityId)}
                                                        className={`${darkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'} transition-colors`}
                                                    >
                                                        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z" />
                                                        </svg>
                                                    </button>
                                                    <p
                                                        onClick={() => handleToggleComments(activity.activityId)}
                                                        className={`text-sm font-bold ${darkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'} cursor-pointer`}>
                                                        {showComments ? 'Hide comments' : `View all ${activity.commentCount || 0} comments`}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Comment Section - Add this block */}
                                            {showComments && (
                                                <CommentSection
                                                    activityId={activity.activityId}
                                                    initialCommentCount={activity.commentCount || 0}
                                                    showComments={showComments}
                                                    setShowComments={(newValue) => {
                                                        if (newValue !== openCommentSections[activity.activityId]) {
                                                            handleToggleComments(activity.activityId);
                                                        }
                                                    }}
                                                />
                                            )}
                                        </div>
                                    </div>
                                );
                            })}

                            {/* Load More Button */}
                            {currentPage < totalPages && (
                                <div className="flex justify-center mt-6">
                                    <button
                                        onClick={loadMoreActivities}
                                        className={`px-4 py-2 text-sm font-medium rounded-md ${loading ? 'opacity-50 cursor-not-allowed' : ''} ${darkMode ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <div className="flex items-center space-x-3">
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#0054A6]"></div>
                                                <span>Loading</span>
                                            </div>
                                        ) : (
                                            'Load More'
                                        )}
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className={`text-center ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                            <p>No activities found!</p>
                        </div>
                    )}
                </>
            )}
        </>
    );
};

export default ActivityCard;