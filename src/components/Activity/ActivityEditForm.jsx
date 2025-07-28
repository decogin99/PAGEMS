import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import activityService from '../../services/activityService';

const IMG_BASE_URL = import.meta.env.VITE_IMG_URL;

const ActivityEditForm = ({ isOpen, onClose, onSubmit, activity }) => {
    const [editedActivity, setEditedActivity] = useState({
        activityId: activity?.activityId || 0,
        activityName: activity?.activityName || '',
    });
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [previewUrls, setPreviewUrls] = useState([]);
    const [keepImageIds, setKeepImageIds] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const { darkMode } = useTheme();

    // Initialize form when activity changes
    useEffect(() => {
        if (activity && isOpen) {
            setEditedActivity({
                activityId: activity.activityId,
                activityName: activity.activityName,
            });

            // Initialize keepImageIds with all current image IDs
            if (activity.activityDetail && activity.activityDetail.length > 0) {
                const imageIds = activity.activityDetail.map(detail => detail.activityDetailId);
                setKeepImageIds(imageIds);
            } else {
                setKeepImageIds([]);
            }

            // Reset other state
            setSelectedFiles([]);
            setPreviewUrls([]);
            setErrorMessage('');
        }
    }, [activity, isOpen]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditedActivity(prev => ({
            ...prev,
            [name]: value
        }));
        setErrorMessage('');
    };

    const handleFileChange = (e) => {
        if (e.target.files) {
            const filesArray = Array.from(e.target.files);
            setSelectedFiles(filesArray);

            // Create preview URLs for selected images
            const newPreviewUrls = filesArray.map(file => URL.createObjectURL(file));
            setPreviewUrls(newPreviewUrls);
            setErrorMessage('');
        }
    };

    const toggleImageKeep = (imageId) => {
        setKeepImageIds(prev => {
            if (prev.includes(imageId)) {
                return prev.filter(id => id !== imageId);
            } else {
                return [...prev, imageId];
            }
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');

        if (keepImageIds.length === 0 && selectedFiles.length === 0) {
            setErrorMessage('Please keep at least one image or upload a new one');
            return;
        }

        setIsLoading(true);
        try {
            const response = await activityService.updateActivity(
                editedActivity.activityId,
                editedActivity.activityName,
                selectedFiles,
                keepImageIds
            );

            if (response.success) {
                onSubmit(response.data);
                // Reset form and close
                setSelectedFiles([]);
                previewUrls.forEach(url => URL.revokeObjectURL(url));
                setPreviewUrls([]);
            } else {
                setErrorMessage(response.message || 'Failed to update activity');
            }
        } catch (error) {
            console.error('Error updating activity:', error);
            setErrorMessage('An unexpected error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div className="flex items-center justify-center min-h-screen px-4 text-center">
                {/* Background overlay */}
                <div
                    className="fixed inset-0 backdrop-blur-sm bg-opacity-75 transition-opacity"
                    aria-hidden="true"
                    onClick={onClose}
                ></div>

                {/* Modal panel */}
                <div className="relative inline-block align-middle bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:max-w-lg w-full">
                    <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} px-4 pt-5 pb-4 sm:p-6 sm:pb-4`}>
                        <div className="flex justify-between items-center mb-4">
                            <h2 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Edit Activity</h2>
                            <button
                                type="button"
                                onClick={onClose}
                                className={`${darkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'}`}
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Error message display */}
                        {errorMessage && (
                            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
                                <p>{errorMessage}</p>
                            </div>
                        )}

                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label htmlFor="activityName" className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                    Activity Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="activityName"
                                    name="activityName"
                                    value={editedActivity.activityName}
                                    onChange={handleInputChange}
                                    className={`w-full px-3 py-2 border rounded-lg ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                                    required
                                />
                            </div>

                            {/* Current Images */}
                            {activity?.activityDetail && activity.activityDetail.length > 0 && (
                                <div className="mb-4">
                                    <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                        Current Images <span className="text-red-500">*</span>
                                    </label>
                                    <div className="grid grid-cols-3 gap-2">
                                        {activity.activityDetail.map((detail) => (
                                            <div key={detail.activityDetailId} className="relative aspect-square rounded overflow-hidden">
                                                <img
                                                    src={`${IMG_BASE_URL}/activity/${detail.image}`}
                                                    alt={`Activity image ${detail.activityDetailId}`}
                                                    className={`w-full h-full object-cover ${!keepImageIds.includes(detail.activityDetailId) ? 'opacity-30 grayscale' : ''}`}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => toggleImageKeep(detail.activityDetailId)}
                                                    className={`absolute top-1 right-1 rounded-full p-1 ${keepImageIds.includes(detail.activityDetailId)
                                                        ? 'bg-red-500 text-white hover:bg-red-600'
                                                        : 'bg-green-500 text-white hover:bg-green-600'}`}
                                                >
                                                    {keepImageIds.includes(detail.activityDetailId) ? (
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                        </svg>
                                                    ) : (
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                        </svg>
                                                    )}
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Add New Images */}
                            <div className="mb-4">
                                <label htmlFor='newImages' className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                    Add New Images (Optional)
                                </label>
                                <div className={`border-2 border-dashed rounded-lg p-4 text-center ${darkMode ? 'border-gray-600 hover:border-gray-500' : 'border-gray-300 hover:border-gray-400'}`}>
                                    <input
                                        type="file"
                                        id="newImages"
                                        name="newImages"
                                        onChange={handleFileChange}
                                        className="hidden"
                                        accept="image/*"
                                        multiple
                                    />
                                    <label htmlFor="newImages" className="cursor-pointer block">
                                        <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                                            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                        <p className={`mt-1 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Click to upload new images</p>
                                    </label>
                                </div>

                                {/* New Image Previews */}
                                {previewUrls.length > 0 && (
                                    <div className="mt-4 grid grid-cols-3 gap-2">
                                        {previewUrls.map((url, index) => (
                                            <div key={index} className="relative aspect-square rounded overflow-hidden">
                                                <img src={url} alt={`New preview ${index}`} className="w-full h-full object-cover" />
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        const newFiles = [...selectedFiles];
                                                        newFiles.splice(index, 1);
                                                        setSelectedFiles(newFiles);

                                                        const newUrls = [...previewUrls];
                                                        URL.revokeObjectURL(newUrls[index]);
                                                        newUrls.splice(index, 1);
                                                        setPreviewUrls(newUrls);
                                                    }}
                                                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                    </svg>
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="flex justify-end">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className={`text-sm mr-2 px-4 py-2 rounded-lg ${darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                                    disabled={isLoading}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="text-sm px-4 py-2 bg-[#0054A6] text-white rounded-lg hover:bg-[#004080] transition-colors flex items-center justify-center min-w-[100px]"
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Updating...
                                        </>
                                    ) : (
                                        'Update Activity'
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ActivityEditForm;