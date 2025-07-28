import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '../../context/ThemeContext';
import announcementService from '../../services/announcementService';

const AnnouncementPostForm = ({ isOpen, onClose, onSuccess }) => {
    const { darkMode } = useTheme();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const editorRef = useRef(null);

    const [newAnnouncement, setNewAnnouncement] = useState({
        title: '',
        description: '',
        type: '',
        file: null
    });

    const announcementTypes = [
        `Internal Event's Note`,
        'Manual Guide Book',
        'Rules and Regulations',
        'Update Announcement',
    ];

    // Reset form when modal is closed
    useEffect(() => {
        if (!isOpen) {
            resetForm();
        }
    }, [isOpen]);

    const resetForm = () => {
        setNewAnnouncement({
            title: '',
            description: '',
            type: '',
            file: null
        });
        setSelectedFile(null);
        setIsSubmitting(false);
        setError(null); // Use null instead of empty string for consistency
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewAnnouncement(prev => ({
            ...prev,
            [name]: value
        }));
        setError(null);
    };

    // Rich text editor functions
    const execCommand = (command, value = null) => {
        document.execCommand(command, false, value);
        editorRef.current?.focus();
    };

    const handleDescriptionChange = () => {
        if (editorRef.current) {
            const content = editorRef.current.innerHTML;
            setNewAnnouncement(prev => ({
                ...prev,
                description: content
            }));
        }
    };

    const insertList = (ordered = false) => {
        const command = ordered ? 'insertOrderedList' : 'insertUnorderedList';
        execCommand(command);
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validate file size (max 10MB)
            if (file.size > 10 * 1024 * 1024) {
                setError('File size must be less than 10MB');
                return;
            }

            // Validate file type
            const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
            if (!allowedTypes.includes(file.type)) {
                setError('Invalid file type. Please upload images, PDF, or Word documents only.');
                return;
            }

            setSelectedFile(file);
            setError(null);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!newAnnouncement.title.trim()) {
            setError('Title is required');
            return;
        }

        if (!newAnnouncement.type) {
            setError('Type is required');
            return;
        }

        setIsSubmitting(true);
        setError(null);

        try {

            // Create announcement
            const response = await announcementService.createAnnouncement(
                newAnnouncement.title.trim(),
                newAnnouncement.description || null,
                newAnnouncement.type,
                selectedFile
            );

            if (response.success) {
                // Reset form
                setNewAnnouncement({
                    title: '',
                    description: '',
                    type: '',
                    file: null
                });
                setSelectedFile(null);
                if (editorRef.current) {
                    editorRef.current.innerHTML = '';
                }

                // Call success callback
                if (onSuccess) {
                    onSuccess(response.data);
                }

                // Close modal
                onClose();
            } else {
                setError(response.message || 'Failed to create announcement');
            }
        } catch (error) {
            console.error('Error creating announcement:', error);
            setError(error.message || 'An unexpected error occurred');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        // Call the onClose prop to close the modal
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div className="flex items-center justify-center min-h-screen px-4 text-center">
                {/* Background overlay */}
                <div
                    className="fixed inset-0 backdrop-blur-sm bg-opacity-75 transition-opacity"
                    aria-hidden="true"
                    onClick={handleClose}
                ></div>

                {/* Modal panel */}
                <div className="relative inline-block align-middle bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:max-w-2xl w-full">
                    <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} px-4 pt-5 pb-4 sm:p-6 sm:pb-4`}>

                        {/* Header */}
                        <div className="flex justify-between items-center mb-4">
                            <h2 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Create New Announcement</h2>
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
                        {error && (
                            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
                                <p>{error}</p>
                            </div>
                        )}

                        {/* Form */}
                        <form onSubmit={handleSubmit}>

                            {/* Title */}
                            <div className="mb-4">
                                <label htmlFor="title" className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                    Title <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="title"
                                    name="title"
                                    value={newAnnouncement.title}
                                    onChange={handleInputChange}
                                    maxLength={200}
                                    required
                                    disabled={isSubmitting}
                                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#0054A6] focus:border-transparent ${darkMode
                                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                                        } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    placeholder="Enter announcement title"
                                />
                                <div className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                    {newAnnouncement.title.length}/200 characters
                                </div>
                            </div>

                            {/* Type */}
                            <div className="mb-4">
                                <label htmlFor="type" className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                    Type <span className="text-red-500">*</span>
                                </label>
                                <select
                                    id="type"
                                    name="type"
                                    value={newAnnouncement.type}
                                    onChange={handleInputChange}
                                    required
                                    disabled={isSubmitting}
                                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#0054A6] focus:border-transparent ${darkMode
                                        ? 'bg-gray-700 border-gray-600 text-white'
                                        : 'bg-white border-gray-300 text-gray-900'
                                        } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    <option value="">Select announcement type</option>
                                    {announcementTypes.map(type => (
                                        <option key={type} value={type}>{type}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Rich Text Description */}
                            <div className="mb-4">
                                <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                    Description
                                </label>

                                {/* Rich Text Editor Toolbar */}
                                <div className={`border rounded-t-lg p-2 flex flex-wrap gap-1 ${darkMode ? 'border-gray-600 bg-gray-700' : 'border-gray-300 bg-gray-50'
                                    }`}>
                                    {/* Text formatting */}
                                    <button
                                        type="button"
                                        onClick={() => execCommand('bold')}
                                        className={`p-2 rounded hover:bg-opacity-80 ${darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-200'}`}
                                        title="Bold"
                                    >
                                        B
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => execCommand('italic')}
                                        className={`p-2 rounded hover:bg-opacity-80 ${darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-200'}`}
                                        title="Italic">
                                        <svg
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                            className="h-3.5 w-3.5">
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2} d="M5.248 20.246H9.05m0 0h3.696m-3.696 0 5.893-16.502m0 0h-3.697m3.697 0h3.803" />
                                        </svg>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => execCommand('underline')}
                                        className={`p-2 rounded hover:bg-opacity-80 ${darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-200'}`}
                                        title="Underline"
                                    >
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M4 18h12v1H4v-1zM6 2v6c0 2.21 1.79 4 4 4s4-1.79 4-4V2h-2v6c0 1.1-.9 2-2 2s-2-.9-2-2V2H6z" />
                                        </svg>
                                    </button>

                                    <div className={`w-px h-6 ${darkMode ? 'bg-gray-600' : 'bg-gray-300'}`}></div>

                                    {/* Lists */}
                                    <button
                                        type="button"
                                        onClick={() => insertList(false)}
                                        className={`p-2 rounded hover:bg-opacity-80 ${darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-200'}`}
                                        title="Bullet List"
                                    >
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                                        </svg>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => insertList(true)}
                                        className={`p-2 rounded hover:bg-opacity-80 ${darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-200'}`}
                                        title="Numbered List"
                                    >
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M3 4h1v1H3V4zm0 3h1v1H3V7zm0 3h1v1H3v-1zm3-6h11v1H6V4zm0 3h11v1H6V7zm0 3h11v1H6v-1z" />
                                        </svg>
                                    </button>

                                    <div className={`w-px h-6 ${darkMode ? 'bg-gray-600' : 'bg-gray-300'}`}></div>

                                    {/* Alignment */}
                                    <button
                                        type="button"
                                        onClick={() => execCommand('justifyLeft')}
                                        className={`p-2 rounded hover:bg-opacity-80 ${darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-200'}`}
                                        title="Align Left"
                                    >
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h8a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h8a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                                        </svg>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => execCommand('justifyCenter')}
                                        className={`p-2 rounded hover:bg-opacity-80 ${darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-200'}`}
                                        title="Align Center"
                                    >
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm2 4a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm-2 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm2 4a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clipRule="evenodd" />
                                        </svg>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => execCommand('justifyRight')}
                                        className={`p-2 rounded hover:bg-opacity-80 ${darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-200'}`}
                                        title="Align Right"
                                    >
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm4 4a1 1 0 011-1h8a1 1 0 110 2H8a1 1 0 01-1-1zm-4 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm4 4a1 1 0 011-1h8a1 1 0 110 2H8a1 1 0 01-1-1z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                </div>

                                {/* Editor */}
                                <div
                                    ref={editorRef}
                                    contentEditable
                                    onInput={handleDescriptionChange}
                                    className={`text-lg w-full min-h-[150px] h-auto px-3 py-2 border border-t-0 rounded-b-md focus:outline-none focus:ring-2 focus:ring-[#0054A6] focus:border-transparent ${darkMode
                                        ? 'bg-gray-700 border-gray-600 text-white'
                                        : 'bg-white border-gray-300 text-gray-900'
                                        } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''} text-sm`}
                                    style={{
                                        wordBreak: 'break-word',
                                        whiteSpace: 'pre-wrap'
                                    }}
                                    data-placeholder="Enter announcement description (optional)"
                                    suppressContentEditableWarning={true}
                                />

                                <style jsx='true'>{`
                                    [contenteditable]:empty:before {
                                        content: attr(data-placeholder);
                                        color: ${darkMode ? '#9CA3AF' : '#6B7280'};
                                        font-style: italic;
                                    }
                                    [contenteditable] {
                                        outline: none;
                                    }
                                    [contenteditable] ul, [contenteditable] ol {
                                        margin-left: 20px;
                                        margin-top: 8px;
                                        margin-bottom: 8px;
                                    }
                                    [contenteditable] li {
                                        margin-bottom: 4px;
                                    }
                                    [contenteditable] p {
                                        margin-bottom: 8px;
                                    }
                                    [contenteditable] strong {
                                        font-weight: bold;
                                    }
                                    [contenteditable] em {
                                        font-style: italic;
                                    }
                                    [contenteditable] u {
                                        text-decoration: underline;
                                    }
                                `}</style>
                            </div>

                            {/* File Upload */}
                            <div className="mb-4 cursor-pointer">
                                <label htmlFor="file" className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'} cursor-pointer`}>
                                    Attachment
                                </label>
                                <input
                                    type="file"
                                    id="file"
                                    onChange={handleFileChange}
                                    disabled={isSubmitting}
                                    accept=".jpg,.jpeg,.png,.gif,.pdf,.doc,.docx"
                                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#0054A6] focus:border-transparent ${darkMode
                                        ? 'bg-gray-700 border-gray-600 text-white file:bg-gray-600 file:text-white file:border-gray-500'
                                        : 'bg-white border-gray-300 text-gray-900 file:bg-gray-50 file:text-gray-700 file:border-gray-300'
                                        } file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium hover:file:bg-opacity-80 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''} cursor-pointer`}
                                />
                                {selectedFile && (
                                    <div className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                        Selected: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                                    </div>
                                )}
                                <div className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                    Supported formats: JPG, PNG, GIF, PDF, DOC, DOCX (Max: 10MB)
                                </div>
                            </div>

                            {/* Action buttons */}
                            <div className="flex justify-end">
                                <button
                                    type="button"
                                    onClick={handleClose}
                                    className={`text-sm mr-2 px-4 py-2 rounded-lg ${darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                                    disabled={isSubmitting}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="text-sm px-4 py-2 bg-[#0054A6] text-white rounded-lg hover:bg-[#004080] transition-colors flex items-center justify-center min-w-[100px]"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting && (
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                    )}
                                    {isSubmitting ? 'Creating...' : 'Create Announcement'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AnnouncementPostForm;