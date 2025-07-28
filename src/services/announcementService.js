import { handleApiRequest, axiosInstance } from './apiService';

class AnnouncementService {
    /**
     * Fetches paginated announcement list
     * @param {number} page - The page number to fetch
     * @returns {Promise} - The API response with paginated announcements
     */
    async getAnnouncements(page = 1) {
        return handleApiRequest(async () => {
            return axiosInstance.get('/Announcement/getAnnouncementList', {
                params: { page }
            });
        });
    }

    /**
     * Gets announcement by ID
     * @param {string|number} id - The ID of the announcement to fetch
     * @returns {Promise} - The API response with announcement details
     */
    async getAnnouncementById(id) {
        return handleApiRequest(async () => {
            return axiosInstance.get(`/Announcement/${id}`);
        });
    }

    /**
     * Creates a new announcement with optional file attachment
     * @param {string} title - The title of the announcement
     * @param {string} description - The description/content of the announcement
     * @param {string} type - The type of announcement
     * @param {File} file - Optional file attachment
     * @returns {Promise} - The API response
     */
    async createAnnouncement(title, description, type, file = null) {
        // Create a FormData object to handle file uploads
        const formData = new FormData();

        // Add the announcement data
        formData.append('title', title);
        if (description && description.trim() !== '') {
            formData.append('description', description);
        }
        formData.append('type', type);

        // Add file if provided
        if (file) {
            formData.append('file', file);
        }

        // Use the handleApiRequest function to make the API call
        return handleApiRequest(async () => {
            return axiosInstance.post('/Announcement/createAnnouncement', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
        });
    }

    /**
     * Updates an existing announcement
     * @param {string|number} announcementId - The ID of the announcement to update
     * @param {string} title - The updated title of the announcement
     * @param {string} description - The updated description/content of the announcement
     * @param {string} type - The updated type of announcement
     * @param {File} file - Optional new file attachment
     * @param {boolean} keepCurrentFile - Whether to keep the current file (true) or update/remove it (false)
     * @returns {Promise} - The API response
     */
    async updateAnnouncement(announcementId, title, description, type, file = null, keepCurrentFile = true) {
        // Create a FormData object to handle file uploads
        const formData = new FormData();

        // Add the announcement data according to AnnouncementUpdateDto
        formData.append('AnnouncementId', announcementId);
        formData.append('Title', title);
        formData.append('Description', description || '');
        formData.append('Type', type);
        formData.append('keepCurrentFile', keepCurrentFile);

        // Add file if provided and not keeping current file
        if (file && !keepCurrentFile) {
            formData.append('File', file);
        }

        // Use the handleApiRequest function to make the API call
        return handleApiRequest(async () => {
            return axiosInstance.put('/Announcement/updateAnnouncement', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
        });
    }

    /**
     * Deletes an announcement
     * @param {string|number} announcementId - The ID of the announcement to delete
     * @returns {Promise} - The API response
     */
    async deleteAnnouncement(announcementId) {
        return handleApiRequest(async () => {
            return axiosInstance.delete(`/Announcement/deleteAnnouncement/${announcementId}`);
        });
    }

    /**
     * Uploads a file for announcement
     * @param {File} file - The file to upload
     * @returns {Promise} - The API response with file information
     */
    async uploadFile(file) {
        // Create a FormData object to handle file upload
        const formData = new FormData();
        formData.append('file', file);

        // Use the handleApiRequest function to make the API call
        return handleApiRequest(async () => {
            return axiosInstance.post('/Announcement/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
        });
    }
}

export default new AnnouncementService();