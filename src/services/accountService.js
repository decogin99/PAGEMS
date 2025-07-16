import apiService from './apiService';

export const accountApi = {
    fetchAccountList: async (page = 1) => {
        return apiService.get('/Account/getAccountList', { page });
    },

    deactivateAccount: async (accountId) => {
        return apiService.put(`/Account/deactivate/${accountId}`);
    },

    updatePermissions: async (accountId, permissions) => {
        return apiService.put(`/Account/updatePermissions/${accountId}`, permissions);
    },



    // Add other account-related API methods here as needed
};

export default accountApi;