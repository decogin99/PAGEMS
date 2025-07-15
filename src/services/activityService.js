import { handleApiRequest, axiosInstance } from './apiService';

class ActivityService {
    /**
     * Fetches paginated activity list
     * @param {number} page - The page number to fetch
     * @returns {Promise} - The API response with paginated activities
     */
    async getActivityList(page = 1) {
        return handleApiRequest(async () => {
            return axiosInstance.get('/Activity/getActivityList', {
                params: { page }
            });
        });
    }

    /**
     * Creates a new activity with images
     * @param {string} activityName - The name of the activity
     * @param {File[]} files - Array of image files to upload
     * @returns {Promise} - The API response
     */
    async createActivity(activityName, files) {
        // Create a FormData object to handle file uploads
        const formData = new FormData();

        // Add the activity name
        formData.append('activityName', activityName);

        // Add each file to the FormData object
        if (files && files.length > 0) {
            files.forEach((file) => {
                formData.append(`images`, file);
            });
        }

        // Use the handleApiRequest function to make the API call
        return handleApiRequest(async () => {
            return axiosInstance.post('/Activity/createActivity', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
        });
    }

    /**
     * Updates an existing activity
     * @param {number} activityId - The ID of the activity to update
     * @param {string} activityName - The updated name of the activity
     * @param {File[]} newFiles - Array of new image files to upload
     * @param {string[]} keepImageIds - Array of existing image IDs to keep
     * @returns {Promise} - The API response
     */
    async updateActivity(activityId, activityName, newFiles = [], keepImageIds = []) {
        // Create a FormData object to handle file uploads
        const formData = new FormData();

        // Add the activity ID and name
        formData.append('activityId', activityId);
        formData.append('activityName', activityName);

        // Add IDs of images to keep
        if (keepImageIds && keepImageIds.length > 0) {
            keepImageIds.forEach(id => {
                formData.append('keepImageIds', id);
            });
        }

        // Add new files
        if (newFiles && newFiles.length > 0) {
            newFiles.forEach(file => {
                formData.append('newImages', file);
            });
        }

        // Use the handleApiRequest function to make the API call
        return handleApiRequest(async () => {
            return axiosInstance.put('/Activity/updateActivity', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
        });
    }

    /**
     * Deletes an activity
     * @param {number} activityId - The ID of the activity to delete
     * @returns {Promise} - The API response
     */
    async deleteActivity(activityId) {
        return handleApiRequest(async () => {
            return axiosInstance.delete(`/Activity/deleteActivity/${activityId}`);
        });
    }

    /**
     * Toggles like status for an activity
     * @param {string} activityId - The ID of the activity to like/unlike
     * @returns {Promise} - The API response
     * @deprecated Use likeActivity or unlikeActivity instead
     */
    async toggleLike(activityId) {
        return handleApiRequest(async () => {
            return axiosInstance.post('/Activity/toggleLike', {
                activityId
            });
        });
    }

    /**
     * Likes an activity
     * @param {string} activityId - The ID of the activity to like
     * @returns {Promise} - The API response
     */
    async likeActivity(activityId) {
        return handleApiRequest(async () => {
            return axiosInstance.post('/Activity/likeActivity', {
                activityId
            });
        });
    }

    /**
     * Unlikes an activity
     * @param {string} activityId - The ID of the activity to unlike
     * @returns {Promise} - The API response
     */
    async unlikeActivity(activityId) {
        return handleApiRequest(async () => {
            return axiosInstance.post('/Activity/unlikeActivity', {
                activityId
            });
        });
    }

    /**
     * Gets comments for an activity
     * @param {string} activityId - The ID of the activity to get comments for
     * @returns {Promise} - The API response with comments
     */
    async getComments(activityId) {
        return handleApiRequest(async () => {
            return axiosInstance.get(`/Activity/getComments/${activityId}`);
        });
    }

    /**
     * Adds a comment to an activity
     * @param {string} activityId - The ID of the activity to comment on
     * @param {string} commentText - The text content of the comment
     * @returns {Promise} - The API response
     */
    async addComment(activityId, commentText) {
        return handleApiRequest(async () => {
            return axiosInstance.post('/Activity/addComment', {
                activityId,
                commentText
            });
        });
    }

    /**
     * Deletes a comment
     * @param {string} commentId - The ID of the comment to delete
     * @returns {Promise} - The API response
     */
    async deleteComment(commentId) {
        return handleApiRequest(async () => {
            return axiosInstance.delete(`/Activity/deleteComment/${commentId}`);
        });
    }
}

export default new ActivityService();