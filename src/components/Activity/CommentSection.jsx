import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import activityService from '../../services/activityService';
import signalRService from '../../services/signalRService';

const IMG_BASE_URL = import.meta.env.VITE_IMG_URL;


const CommentSection = ({ activityId, initialCommentCount = 0, showComments, setShowComments }) => {
    const { darkMode } = useTheme();
    const { user } = useAuth();
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(false);
    const [commentCount, setCommentCount] = useState(initialCommentCount);
    const [submitting, setSubmitting] = useState(false);

    // Fetch comments when the section is expanded
    useEffect(() => {
        if (showComments) {
            fetchComments();
        }
    }, [showComments]);

    // Set up SignalR listeners for real-time comment updates
    useEffect(() => {
        if (!activityId) return;

        // Listen for comment added events
        const unsubscribeCommentAdded = signalRService.on('ActivityCommented', (commentData) => {
            if (commentData.activityId === activityId) {
                // Fetch the latest comments when a new comment is added
                if (showComments) {
                    fetchComments();
                }
                // Update comment count
                setCommentCount(commentData.commentCount);
            }
        });

        // Listen for comment deleted events
        const unsubscribeCommentDeleted = signalRService.on('CommentDeleted', (commentData) => {
            if (commentData.activityId === activityId) {
                // Update the comments list by removing the deleted comment
                setComments(prevComments => {
                    return prevComments.filter(comment => comment.commentId !== commentData.commentId);
                });
                // Update comment count
                setCommentCount(commentData.commentCount);
            }
        });

        // Clean up listeners when component unmounts
        return () => {
            unsubscribeCommentAdded();
            unsubscribeCommentDeleted();
        };
    }, [activityId, showComments, setShowComments]);

    // Make sure this useEffect is properly updating the comment count when initialCommentCount changes
    useEffect(() => {
        setCommentCount(initialCommentCount);
    }, [initialCommentCount]);

    // When fetching comments, only update the count if we have comments
    const fetchComments = async () => {
        if (!activityId) return;

        setLoading(true);
        try {
            const response = await activityService.getComments(activityId);
            if (response.success) {
                setComments(response.data || []);
                // Don't update the comment count if the response data is empty
                // This prevents the count from being reset to 0 when there are no comments
                if (response.data && response.data.length > 0) {
                    setCommentCount(response.data.length);
                }
            }
        } catch (error) {
            console.error('Error fetching comments:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmitComment = async (e) => {
        e.preventDefault();
        if (!newComment.trim() || submitting) return;

        setSubmitting(true);
        try {
            const response = await activityService.addComment(activityId, newComment.trim());
            if (response.success) {
                // The comment will be added via SignalR, so we don't need to update the state here
                setNewComment('');
                // Ensure comments section stays open after adding a comment
                setShowComments(true);
            }
        } catch (error) {
            console.error('Error adding comment:', error);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteComment = async (commentId) => {
        try {
            await activityService.deleteComment(commentId);
            // The comment will be removed via SignalR, so we don't need to update the state here
        } catch (error) {
            console.error('Error deleting comment:', error);
        }
    };

    const toggleComments = () => {
        setShowComments(!showComments);
    };

    const formatTimeAgo = (date) => {
        // Convert UTC date string to local Date object
        const utcDate = new Date(date + 'Z');
        const now = new Date();
        const diffInSeconds = Math.floor((now - utcDate) / 1000);

        if (diffInSeconds < 5) return 'just now';
        if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;

        const diffInMinutes = Math.floor(diffInSeconds / 60);
        if (diffInMinutes < 60) return `${diffInMinutes} ${diffInMinutes === 1 ? 'minute' : 'minutes'} ago`;

        const diffInHours = Math.floor(diffInMinutes / 60);
        if (diffInHours < 24) return `${diffInHours} ${diffInHours === 1 ? 'hour' : 'hours'} ago`;

        const diffInDays = Math.floor(diffInHours / 24);
        if (diffInDays < 7) return `${diffInDays} ${diffInDays === 1 ? 'day' : 'days'} ago`;

        const diffInWeeks = Math.floor(diffInDays / 7);
        if (diffInWeeks < 4) return `${diffInWeeks} ${diffInWeeks === 1 ? 'week' : 'weeks'} ago`;

        const diffInMonths = Math.floor(diffInDays / 30);
        if (diffInMonths < 12) return `${diffInMonths} ${diffInMonths === 1 ? 'month' : 'months'} ago`;

        const diffInYears = Math.floor(diffInDays / 365);
        return `${diffInYears} ${diffInYears === 1 ? 'year' : 'years'} ago`;
    };

    return (
        <div className={`px-4 pt-2 pb-4 rounded-b-lg ${darkMode ? 'text-gray-200' : 'text-gray-800 bg-gray-200'}`}>
            {/* Comment toggle button */}
            <button
                onClick={toggleComments}
                className={`text-sm ${darkMode ? 'text-gray-400 hover:text-gray-200' : 'text-black hover:text-gray-700'} transition-colors`}
            >
                {showComments ? 'Hide comments' : `View all ${commentCount} comments`}
            </button>

            {/* Comments list */}
            {showComments && (
                <div className="mt-2 space-y-1">
                    {loading ? (
                        <p className="text-sm italic">Loading comments...</p>
                    ) : comments.length > 0 ? (
                        comments.map((comment) => (
                            <div key={comment.commentId} className={`flex items-start space-x-2 ${darkMode ? 'bg-gray-800 hover:bg-gray-900' : 'bg-gray-100'} p-2 rounded-lg`}>
                                {/* Avatar */}
                                <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                                    {comment.commentedPhoto ? (
                                        <img
                                            src={`${IMG_BASE_URL}/employee/${comment.commentedPhoto}`}
                                            alt={comment.commentedBy}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                                            <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium">
                                        {comment.accountId == user.accountId ? 'You' : comment.commentedBy}
                                        <span className="text-xs text-gray-500 ml-2">{formatTimeAgo(comment.createdDate)}</span>
                                    </p>
                                    <p className="text-sm">{comment.commentText}</p>
                                </div>
                                {comment.canDelete && (
                                    <button
                                        onClick={() => handleDeleteComment(comment.commentId)}
                                        className="text-xs text-red-500 hover:text-red-700"
                                    >
                                        Delete
                                    </button>
                                )}
                            </div>
                        ))
                    ) : (
                        <p className="text-sm italic">No comments yet. Be the first to comment!</p>
                    )}
                </div>
            )}

            {/* Comment form */}
            <form onSubmit={handleSubmitComment} className="mt-3 flex items-center">
                <input
                    type="text"
                    name='newComment'
                    value={newComment}
                    autoComplete='off'
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add a comment..."
                    className={`flex-1 rounded-l-lg py-2 px-3 text-sm ${darkMode ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-900'} focus:outline-none`}
                />
                <button
                    type="submit"
                    disabled={!newComment.trim() || submitting}
                    className={`rounded-r-lg py-2 px-4 text-sm font-medium ${darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white transition-colors ${(!newComment.trim() || submitting) ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    {submitting ? 'Posting...' : 'Post'}
                </button>
            </form>
        </div>
    );
};

export default CommentSection;