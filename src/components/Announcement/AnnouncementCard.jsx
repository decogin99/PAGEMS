import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';

const AnnouncementCard = ({
    announcements,
    loading,
    error,
    handleEdit,
    handleDelete,
    loadMoreAnnouncements,
    currentPage,
    totalPages
}) => {
    const { darkMode } = useTheme();
    const [expandedDescriptions, setExpandedDescriptions] = useState({});
    const [downloadStates, setDownloadStates] = useState({});
    const [successMessages, setSuccessMessages] = useState({});

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: '2-digit'
        });
    };

    const handleDownload = async (announcement) => {
        if (announcement.file) {
            const announcementId = announcement.id;

            try {
                // Set loading state
                setDownloadStates(prev => ({
                    ...prev,
                    [announcementId]: { loading: true, progress: 0 }
                }));

                // Construct the full URL
                const baseUrl = import.meta.env.VITE_IMG_URL + `/announcement`;
                const fullUrl = `${baseUrl}/${announcement.file}`;

                // Fetch with progress tracking
                const response = await fetch(fullUrl);
                const contentLength = response.headers.get('content-length');
                const total = parseInt(contentLength, 10);
                let loaded = 0;

                const reader = response.body.getReader();
                const chunks = [];

                while (true) {
                    const { done, value } = await reader.read();

                    if (done) break;

                    chunks.push(value);
                    loaded += value.length;

                    // Update progress
                    const progress = total ? Math.round((loaded / total) * 100) : 0;
                    setDownloadStates(prev => ({
                        ...prev,
                        [announcementId]: { loading: true, progress }
                    }));
                }

                // Create blob from chunks
                const blob = new Blob(chunks);

                // Extract extension from filename
                const getExtensionFromFilename = (filename) => {
                    const extensionMatch = filename.match(/\.(\w+)$/);
                    return extensionMatch ? extensionMatch[1] : 'file';
                };

                const extension = getExtensionFromFilename(announcement.file);

                // Clean the title to make it filename-safe
                const cleanTitle = (announcement.title || 'announcement')
                    .replace(/[^a-zA-Z0-9\s]/g, '') // Remove special characters
                    .replace(/\s+/g, '_') // Replace spaces with underscores
                    .trim();

                // Create download link with blob URL
                const blobUrl = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = blobUrl;
                link.download = `${cleanTitle}.${extension}`;

                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);

                // Clean up the blob URL
                window.URL.revokeObjectURL(blobUrl);

                // Set success state
                setDownloadStates(prev => ({
                    ...prev,
                    [announcementId]: { loading: false, progress: 100 }
                }));

                setSuccessMessages(prev => ({
                    ...prev,
                    [announcementId]: true
                }));

                // Clear success message after 3 seconds
                setTimeout(() => {
                    setSuccessMessages(prev => {
                        const newState = { ...prev };
                        delete newState[announcementId];
                        return newState;
                    });
                    setDownloadStates(prev => {
                        const newState = { ...prev };
                        delete newState[announcementId];
                        return newState;
                    });
                }, 3000);

            } catch (error) {
                console.error('Download failed:', error);

                // Reset loading state on error
                setDownloadStates(prev => {
                    const newState = { ...prev };
                    delete newState[announcementId];
                    return newState;
                });

                // Fallback to direct link if fetch fails
                const baseUrl = import.meta.env.VITE_IMG_URL + `/announcement`;
                const fullUrl = `${baseUrl}/${announcement.file}`;
                window.open(fullUrl, '_blank');
            }
        }
    };

    const toggleDescription = (announcementId) => {
        setExpandedDescriptions(prev => ({
            ...prev,
            [announcementId]: !prev[announcementId]
        }));
    };

    return (
        <>
            {error ? (
                <div className={`p-4 rounded-lg ${darkMode ? 'bg-red-900 text-white' : 'bg-red-100 text-red-700'}`}>
                    {error}
                </div>
            ) : loading && announcements.length === 0 ? (
                <div className="flex justify-center items-center p-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0054A6]"></div>
                </div>
            ) : (
                <>
                    {announcements.length > 0 ? (
                        <>
                            <div className={`${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'} rounded-lg shadow-sm`}>
                                <div className={`divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
                                    {announcements.map((announcement) => (
                                        <div key={announcement.announcementId} className={`px-6 py-4 ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} transition-colors`}>
                                            <div className="flex items-start gap-4">
                                                <div className="bg-[#0054A6]/10 p-3 rounded-lg">

                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" >
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.34 15.84c-.688-.06-1.386-.09-2.09-.09H7.5a4.5 4.5 0 1 1 0-9h.75c.704 0 1.402-.03 2.09-.09m0 9.18c.253.962.584 1.892.985 2.783.247.55.06 1.21-.463 1.511l-.657.38c-.551.318-1.26.117-1.527-.461a20.845 20.845 0 0 1-1.44-4.282m3.102.069a18.03 18.03 0 0 1-.59-4.59c0-1.586.205-3.124.59-4.59m0 9.18a23.848 23.848 0 0 1 8.835 2.535M10.34 6.66a23.847 23.847 0 0 0 8.835-2.535m0 0A23.74 23.74 0 0 0 18.795 3m.38 1.125a23.91 23.91 0 0 1 1.014 5.395m-1.014 8.855c-.118.38-.245.754-.38 1.125m.38-1.125a23.91 23.91 0 0 0 1.014-5.395m0-3.46c.495.413.811 1.035.811 1.73 0 .695-.316 1.317-.811 1.73m0-3.46a24.347 24.347 0 0 1 0 3.46" />
                                                    </svg>
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-center justify-between">
                                                        <h3 className={`text-md font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                                            {announcement.title}
                                                        </h3>
                                                        <div className="flex items-center gap-3">
                                                            <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                                                {formatDate(announcement.createdDate)}
                                                            </span>

                                                            {/* Control Actions Dropdown - only show if user has control permission */}
                                                            {announcement.controlAction && (
                                                                <div className="relative">
                                                                    <button
                                                                        className={`p-1 rounded-full hover:bg-gray-200 ${darkMode ? 'text-gray-300 hover:text-white hover:bg-gray-600' : 'text-gray-500 hover:text-gray-700'}`}
                                                                        onClick={() => {
                                                                            const dropdown = document.getElementById(`dropdown-${announcement.announcementId}`);
                                                                            dropdown.classList.toggle('hidden');
                                                                        }}
                                                                    >
                                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                                                                        </svg>
                                                                    </button>
                                                                    <div
                                                                        id={`dropdown-${announcement.announcementId}`}
                                                                        className={`translate-y-0 fixed right-11 mt-2 w-48 rounded-md shadow-lg py-1 hidden z-[9999] ${darkMode ? 'bg-gray-700 ring-gray-500' : 'bg-white ring-gray-300'} ring-1`}
                                                                        onMouseLeave={() => {
                                                                            document.getElementById(`dropdown-${announcement.announcementId}`).classList.add('hidden');
                                                                        }}
                                                                    >
                                                                        <button
                                                                            onClick={() => {
                                                                                document.getElementById(`dropdown-${announcement.announcementId}`).classList.add('hidden');
                                                                                handleEdit(announcement);
                                                                            }}
                                                                            className={`block px-4 py-2 text-sm w-full text-left ${darkMode ? 'text-gray-300 hover:bg-gray-600' : 'text-gray-700 hover:bg-gray-100'}`}
                                                                        >
                                                                            <div className="flex items-center gap-2">
                                                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                                                </svg>
                                                                                Edit
                                                                            </div>
                                                                        </button>
                                                                        <button
                                                                            onClick={() => {
                                                                                document.getElementById(`dropdown-${announcement.announcementId}`).classList.add('hidden');
                                                                                handleDelete(announcement.announcementId);
                                                                            }}
                                                                            className={`block px-4 py-2 text-sm w-full text-left ${darkMode ? 'text-red-400 hover:bg-gray-600' : 'text-red-600 hover:bg-gray-100'}`}
                                                                        >
                                                                            <div className="flex items-center gap-2">
                                                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                                                </svg>
                                                                                Delete
                                                                            </div>
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <p className={`mt-1 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                                        {announcement.type}
                                                    </p>

                                                    {/* Description with collapsible functionality */}
                                                    {announcement.description && (
                                                        <div className="mt-2">
                                                            {!expandedDescriptions[announcement.announcementId] ? (
                                                                <button
                                                                    onClick={() => toggleDescription(announcement.announcementId)}
                                                                    className="text-sm text-blue-500 hover:text-blue-800 font-medium flex items-center gap-2"
                                                                >
                                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                                    </svg>
                                                                    View Content
                                                                </button>
                                                            ) : (
                                                                <div>
                                                                    <div className="flex items-center justify-between mb-2">
                                                                        <button
                                                                            onClick={() => toggleDescription(announcement.announcementId)}
                                                                            className="text-sm text-blue-500 hover:text-blue-800 font-medium flex items-center gap-2"
                                                                        >
                                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                                                                            </svg>
                                                                            Hide Content
                                                                        </button>
                                                                    </div>
                                                                    <div className={`text-md p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                                                                        <div
                                                                            className={`announcement-content ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}
                                                                            dangerouslySetInnerHTML={{ __html: announcement.description }}
                                                                        />
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}

                                                    {announcement.file && (
                                                        <div className="flex items-center gap-2 mt-2">
                                                            <span
                                                                onClick={() => handleDownload(announcement)}
                                                                className={`text-sm cursor-pointer transition-colors ${downloadStates[announcement.id]?.loading
                                                                    ? 'text-gray-400 cursor-not-allowed'
                                                                    : 'text-blue-500 hover:text-blue-800'
                                                                    }`}
                                                                style={{ pointerEvents: downloadStates[announcement.id]?.loading ? 'none' : 'auto' }}
                                                            >
                                                                {downloadStates[announcement.id]?.loading ? (
                                                                    <span className="flex items-center gap-1">
                                                                        <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24">
                                                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                                                        </svg>
                                                                        Downloading {downloadStates[announcement.id]?.progress}%
                                                                    </span>
                                                                ) : (
                                                                    <span className="flex items-center gap-1">
                                                                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                                                                        </svg>

                                                                        Download
                                                                    </span>
                                                                )}
                                                            </span>
                                                            {successMessages[announcement.id] && (
                                                                <span className="text-green-600 dark:text-green-400 text-sm font-medium flex items-center gap-1">
                                                                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                                                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                                    </svg>
                                                                    Downloaded!
                                                                </span>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Load More Button */}
                            {currentPage < totalPages && (
                                <div className="flex justify-center mt-6">
                                    <button
                                        onClick={loadMoreAnnouncements}
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
                        </>
                    ) : (
                        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-sm py-6 text-center`}>
                            <svg className={`w-12 h-12 mx-auto ${darkMode ? 'text-gray-600' : 'text-gray-400'} mb-4`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                            </svg>
                            <div className={`text-center ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                                <p>No announcement found!</p>
                            </div>
                        </div>
                    )}
                </>
            )}
        </>
    );
};

export default AnnouncementCard;