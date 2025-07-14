import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import activityService from '../../services/activityService';

const ActivityPostForm = ({ isOpen, onClose, onSubmit }) => {
    const [newPost, setNewPost] = useState({
        activityName: '',
        images: []
    });
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [previewUrls, setPreviewUrls] = useState([]);
    const [photoError, setPhotoError] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState(''); // New state for error messages
    const { darkMode } = useTheme();

    // Reset form when modal is closed
    useEffect(() => {
        if (!isOpen) {
            resetForm();
        }
    }, [isOpen]);

    const resetForm = () => {
        setNewPost({ activityName: '', images: [] });
        setSelectedFiles([]);
        // Revoke object URLs to prevent memory leaks
        previewUrls.forEach(url => URL.revokeObjectURL(url));
        setPreviewUrls([]);
        setPhotoError(false);
        setIsLoading(false);
        setErrorMessage(''); // Clear error message when resetting form
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewPost(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error message when user makes changes
        setErrorMessage('');
    };

    const handleFileChange = (e) => {
        if (e.target.files) {
            const filesArray = Array.from(e.target.files);
            setSelectedFiles(filesArray);

            // Create preview URLs for selected images
            const newPreviewUrls = filesArray.map(file => URL.createObjectURL(file));
            setPreviewUrls(newPreviewUrls);

            // Clear photo error if photos are added
            if (filesArray.length > 0) {
                setPhotoError(false);
            }

            // Clear error message when user makes changes
            setErrorMessage('');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Clear any previous error messages
        setErrorMessage('');

        // Validate that at least one photo is selected
        if (selectedFiles.length === 0) {
            setPhotoError(true);
            return;
        }

        // Set loading state
        setIsLoading(true);

        try {
            // Call the activity service to create a new activity
            const response = await activityService.createActivity(
                newPost.activityName,
                selectedFiles
            );

            if (response.success) {
                // Pass the response data to parent component
                onSubmit(response.data);
                // Reset form
                resetForm();
            } else {
                // Handle error with UI display instead of alert
                setErrorMessage(response.message || 'Failed to create activity');
                setIsLoading(false);
            }
        } catch (error) {
            console.error('Error creating activity:', error);
            setErrorMessage('An unexpected error occurred');
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        // Call the onClose prop to close the modal
        onClose();
    };

    if (!isOpen) return null;

    // The rest of the component remains the same
    return (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div className="flex items-center justify-center min-h-screen p-4 text-center">
                {/* Background overlay */}
                <div
                    className="fixed inset-0 backdrop-blur-sm bg-opacity-75 transition-opacity"
                    aria-hidden="true"
                    onClick={handleClose}
                ></div>

                {/* Modal panel */}
                <div className="relative inline-block align-middle bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:max-w-lg w-full">
                    <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} px-4 pt-5 pb-4 sm:p-6 sm:pb-4`}>
                        <div className="flex justify-between items-center mb-4">
                            <h2 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Create New Activity Post</h2>
                            <button
                                type="button"
                                onClick={handleClose}
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
                                    Activity Name
                                </label>
                                <input
                                    type="text"
                                    id="activityName"
                                    name="activityName"
                                    value={newPost.activityName}
                                    onChange={handleInputChange}
                                    className={`w-full px-3 py-2 border rounded-lg ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                                    required
                                />
                            </div>

                            <div className="mb-4">
                                <label htmlFor='images' className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                    Images
                                </label>
                                <div className={`border-2 border-dashed rounded-lg p-4 text-center ${photoError ? 'border-red-500' : darkMode ? 'border-gray-600 hover:border-gray-500' : 'border-gray-300 hover:border-gray-400'}`}>
                                    <input
                                        type="file"
                                        id="images"
                                        name="images"
                                        onChange={handleFileChange}
                                        className="hidden"
                                        accept="image/*"
                                        multiple
                                    />
                                    <label htmlFor="images" className="cursor-pointer block">
                                        <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                                            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                        <p className={`mt-1 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Click to upload images</p>
                                    </label>
                                </div>

                                {/* Photo error message */}
                                {photoError && (
                                    <p className="mt-1 text-sm text-red-500">Please add at least one photo</p>
                                )}

                                {/* Image Previews */}
                                {previewUrls.length > 0 && (
                                    <div className="mt-4 grid grid-cols-3 gap-2">
                                        {previewUrls.map((url, index) => (
                                            <div key={index} className="relative aspect-square rounded overflow-hidden">
                                                <img src={url} alt={`Preview ${index}`} className="w-full h-full object-cover" />
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

                                                        // Set photo error if no photos remain
                                                        if (newFiles.length === 0) {
                                                            setPhotoError(true);
                                                        }

                                                        // Clear error message when user makes changes
                                                        setErrorMessage('');
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
                                    onClick={handleClose}
                                    className={`mr-2 px-4 py-2 rounded-lg ${darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                                    disabled={isLoading}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-[#0054A6] text-white rounded-lg hover:bg-[#004080] transition-colors flex items-center justify-center min-w-[100px]"
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Posting...
                                        </>
                                    ) : (
                                        'Create Post'
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

export default ActivityPostForm;