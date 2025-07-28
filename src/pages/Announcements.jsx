import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import AnnouncementPostForm from '../components/Announcement/AnnouncementPostForm';
import AnnouncementEditForm from '../components/Announcement/AnnouncementEditForm';
import AnnouncementCard from '../components/Announcement/AnnouncementCard';
import announcementService from '../services/announcementService';
import signalRService from '../services/signalRService';

const Announcements = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const { darkMode } = useTheme();
    const { user } = useAuth();
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);
    const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [announcementToDelete, setAnnouncementToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    // Check if user has Full Control permission for announcements
    const hasFullControl = user?.permissions?.activityViewControl === 'Full Control';

    // Fetch announcements
    const fetchAnnouncements = async (page = 1, append = false) => {
        try {
            if (!append) {
                setLoading(true);
                setError(null);
            }

            const response = await announcementService.getAnnouncements(page);

            if (response.success) {
                // If append is true, add new activities to existing ones
                // Otherwise, replace the activities list
                if (append) {
                    setAnnouncements(prevAnnouncements => [...prevAnnouncements, ...(response.data.data || [])]);
                } else {
                    setAnnouncements(response.data.data || []);
                }
                setTotalPages(response.data.totalPages || 1);
                setCurrentPage(page);
            } else {
                setError(response.message || 'Failed to fetch announcements');
            }
        } catch (err) {
            setError('An error occurred while fetching announcements');
            console.error('Error fetching announcements:', err);
        } finally {
            if (!append) {
                setLoading(false);
            }
        }
    };

    // Load announcements on component mount
    useEffect(() => {
        fetchAnnouncements();
    }, []);

    // Set up SignalR listeners for real-time announcement updates
    useEffect(() => {
        // Listen for announcement added events
        const unsubscribeAnnouncementAdded = signalRService.on('AnnouncementAdded', () => {
            // Refresh announcements list when a new announcement is added
            fetchAnnouncements(1, false); // Reset to first page
        });

        // Listen for announcement updated events
        const unsubscribeAnnouncementUpdated = signalRService.on('AnnouncementUpdated', () => {
            // Refresh announcements list when an announcement is updated
            fetchAnnouncements(currentPage, false); // Stay on current page
        });

        // Listen for announcement deleted events
        const unsubscribeAnnouncementDeleted = signalRService.on('AnnouncementDeleted', (deletedAnnouncementId) => {
            // Remove the deleted announcement from the list
            setAnnouncements(prevAnnouncements =>
                prevAnnouncements.filter(announcement => announcement.announcementId !== deletedAnnouncementId)
            );
        });

        // Clean up listeners when component unmounts
        return () => {
            unsubscribeAnnouncementAdded();
            unsubscribeAnnouncementUpdated();
            unsubscribeAnnouncementDeleted();
        };
    }, [currentPage]);

    const handleAnnouncementCreated = () => {
        // Close the form - SignalR will handle the refresh
        setShowCreateForm(false);
        // Note: fetchAnnouncements will be called by SignalR event
    };

    const handleEdit = (announcement) => {
        setSelectedAnnouncement(announcement);
        setShowEditForm(true);
    };

    const handleAnnouncementUpdated = () => {
        // Close the form - SignalR will handle the refresh
        setShowEditForm(false);
        setSelectedAnnouncement(null);
        // Note: fetchAnnouncements will be called by SignalR event
    };

    const handleDeleteClick = (announcementId) => {
        setAnnouncementToDelete(announcementId);
        setShowDeleteConfirm(true);
    };

    const confirmDelete = async () => {
        if (!announcementToDelete) return;

        setIsDeleting(true);
        try {
            const response = await announcementService.deleteAnnouncement(announcementToDelete);
            if (!response.success) {
                setError(response.message || 'Failed to delete announcement');
            }
            // SignalR will handle the real-time update
        } catch (err) {
            setError('An error occurred while deleting the announcement');
            console.error('Error deleting announcement:', err);
        } finally {
            setIsDeleting(false);
            setShowDeleteConfirm(false);
            setAnnouncementToDelete(null);
        }
    };

    const cancelDelete = () => {
        setShowDeleteConfirm(false);
        setAnnouncementToDelete(null);
    };

    const loadMoreAnnouncements = () => {
        if (currentPage < totalPages && !loading) {
            fetchAnnouncements(currentPage + 1, true);
        }
    };

    return (
        <div className={`fixed inset-0 flex flex-col ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
            <div className={`${isSidebarOpen ? 'backdrop-blur-sm' : ''} transition-all duration-300`}>
                <Navbar onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />
            </div>
            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

            {/* Create Announcement Modal */}
            <AnnouncementPostForm
                isOpen={showCreateForm}
                onClose={() => setShowCreateForm(false)}
                onSuccess={handleAnnouncementCreated}
            />

            {/* Edit Announcement Modal */}
            <AnnouncementEditForm
                isOpen={showEditForm}
                onClose={() => {
                    setShowEditForm(false);
                    setSelectedAnnouncement(null);
                }}
                onSuccess={handleAnnouncementUpdated}
                announcement={selectedAnnouncement}
            />

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                    <div className="flex items-center justify-center min-h-screen p-4 text-center">
                        <div className="fixed inset-0 backdrop-blur-sm bg-opacity-75 transition-opacity" aria-hidden="true"></div>
                        <div className={`relative inline-block align-middle ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:max-w-lg w-full p-6`}>
                            <div className="text-center">
                                <h3 className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>Confirm Delete</h3>
                                <p className={`${darkMode ? 'text-gray-300' : 'text-gray-500'} mb-6`}>Are you sure you want to delete this announcement? This action cannot be undone.</p>
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
                    <div className="mx-auto">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">
                            <div>
                                <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                    Announcements
                                </h1>
                            </div>
                            <div className="flex items-center space-x-4">
                                {hasFullControl && (
                                    <button
                                        onClick={() => setShowCreateForm(true)}
                                        className="text-sm px-4 py-2 bg-[#0054A6] text-white rounded-lg hover:bg-[#004080] transition-colors w-full sm:w-auto flex items-center justify-center gap-2">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                        </svg>
                                        New Announcement
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Announcements Feed */}
                        <AnnouncementCard
                            announcements={announcements}
                            loading={loading}
                            error={error}
                            handleEdit={handleEdit}
                            handleDelete={handleDeleteClick}
                            loadMoreAnnouncements={loadMoreAnnouncements}
                            currentPage={currentPage}
                            totalPages={totalPages}
                        />
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Announcements;
