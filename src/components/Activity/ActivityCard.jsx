import { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import activityService from '../../services/activityService';
import CommentSection from './CommentSection';

const IMG_BASE_URL = import.meta.env.VITE_IMG_URL;

const ActivityCard = ({ activity, onEdit, onDelete, onToggleComments, showComments }) => {
    const { darkMode } = useTheme();
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [showOptions, setShowOptions] = useState(false);
    const [isLiking, setIsLiking] = useState(false);
    const [localLikeCount, setLocalLikeCount] = useState(activity.likeCount || 0);
    const [hasLiked, setHasLiked] = useState(activity.isLikedByCurrentUser || false);

    // Check if activity has images
    const hasImages = activity.activityDetail && activity.activityDetail.length > 0;
    const totalImages = hasImages ? activity.activityDetail.length : 0;

    // Navigation functions
    const goToPrevImage = () => {
        setCurrentImageIndex((prev) => (prev === 0 ? totalImages - 1 : prev - 1));
    };

    const goToNextImage = () => {
        setCurrentImageIndex((prev) => (prev === totalImages - 1 ? 0 : prev + 1));
    };

    // Handle edit and delete
    const handleEdit = () => {
        setShowOptions(false);
        onEdit(activity);
    };

    const handleDelete = () => {
        setShowOptions(false);
        onDelete(activity.activityId);
    };

    // Handle like toggle
    const handleLikeToggle = async () => {
        if (isLiking) return;

        setIsLiking(true);
        try {
            if (hasLiked) {
                await activityService.unlikeActivity(activity.activityId);
                // Don't update the count here - let SignalR handle it
            } else {
                await activityService.likeActivity(activity.activityId);
                // Don't update the count here - let SignalR handle it
            }
        } catch (error) {
            console.error('Error toggling like:', error);
        } finally {
            setIsLiking(false);
        }
    };


    // Update the useEffect that syncs with activity props
    useEffect(() => {
        setLocalLikeCount(activity.likeCount || 0);
        setHasLiked(activity.isLikedByCurrentUser || false);
        // No need to update showComments here as it would close the comment section
    }, [activity.likeCount, activity.isLikedByCurrentUser]);

    return (
        <div className={`rounded-lg shadow-md overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            {/* Post Header */}
            <div className="p-4 flex items-center justify-between">
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
                {activity.controlAction && (
                    <div className="relative">
                        <button
                            onClick={() => setShowOptions(!showOptions)}
                            className={`${darkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                            </svg>
                        </button>

                        {/* Options dropdown */}
                        {showOptions && (
                            <div className={`absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 z-10 ${darkMode ? 'bg-gray-700' : 'bg-white'} ring-1 ring-gray-300 ring-opacity-5 focus:outline-none`}>
                                <button
                                    onClick={handleEdit}
                                    className={`block px-4 py-2 text-sm w-full text-left ${darkMode ? 'text-gray-200 hover:bg-gray-600' : 'text-gray-700 hover:bg-gray-100'}`}
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={handleDelete}
                                    className={`block px-4 py-2 text-sm w-full text-left ${darkMode ? 'text-red-400 hover:bg-gray-600' : 'text-red-500 hover:bg-gray-100'}`}
                                >
                                    Delete
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Images Carousel */}
            <div className="relative aspect-square bg-black">
                {hasImages && (
                    <>
                        <img
                            src={`${IMG_BASE_URL}/activity/${activity.activityDetail[currentImageIndex].image}`}
                            alt={`${activity.activityName} - Image ${currentImageIndex + 1}`}
                            className="w-full h-full object-contain"
                        />

                        {/* image counter */}
                        {totalImages > 1 && (
                            <div className="absolute top-4 right-4 bg-black/50 text-white px-2 py-1 rounded-full text-xs">
                                {currentImageIndex + 1}/{totalImages}
                            </div>
                        )}

                        {/* Navigation arrows - only show if there are multiple images */}
                        {totalImages > 1 && (
                            <>
                                <button
                                    onClick={goToPrevImage}
                                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white rounded-full p-1 hover:bg-black/70 transition-colors"
                                    aria-label="Previous image"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                    </svg>
                                </button>
                                <button
                                    onClick={goToNextImage}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white rounded-full p-1 hover:bg-black/70 transition-colors"
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
                                            onClick={() => setCurrentImageIndex(index)}
                                            className={`w-2 h-2 rounded-full ${currentImageIndex === index ? 'bg-white' : 'bg-white/50'}`}
                                            aria-label={`Go to image ${index + 1}`}
                                        />
                                    ))}
                                </div>
                            </>
                        )}
                    </>
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
                        onClick={handleLikeToggle}
                        disabled={isLiking}
                        className={`transition-colors ${isLiking ? 'opacity-50' : ''} ${hasLiked
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
                        onClick={() => onToggleComments(activity.activityId)}
                        className={`${darkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'} transition-colors`}
                    >
                        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z" />
                        </svg>
                    </button>
                    <p
                        onClick={() => onToggleComments(activity.activityId)}
                        className={`text-sm font-bold ${darkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'} cursor-pointer`}>
                        {showComments ? 'Hide comments' : `View all ${activity.commentCount || 0} comments`}
                    </p>
                </div>
                {/* <div className="mt-2">
                    <p className={`text-sm ${darkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'}`}>
                        {showComments ? 'Hide comments' : `View all ${activity.commentCount || 0} comments`}
                    </p>

                </div> */}
            </div>
        </div>
    )
}

export default ActivityCard;
