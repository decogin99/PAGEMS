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
            files.forEach((file, index) => {
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
}

export default new ActivityService();