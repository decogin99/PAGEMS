import apiService from './apiService';

export const accountApi = {
    fetchAccountList: async (page = 1) => {
        return apiService.get('/Account/getAccountList', { page });
    },

    deactivateAccount: async (accountId) => {
        return apiService.put(`/Account/deactivate/${accountId}`);
    },

    updatePermissions: async (accountId, permissions) => {
        return apiService.put('/Account/updatePermission', {
            accountId,
            dashboardView: permissions.Dashboard?.hasAccess || false,
            announcementView: permissions.Announcement?.hasAccess || false,
            announcementViewControl: permissions.Announcement?.role || 'Unset',
            activityView: permissions.Activities?.hasAccess || false,
            activityViewControl: permissions.Activities?.role || 'Unset',
            employeeView: permissions.Employees?.hasAccess || false,
            employeeViewControl: permissions.Employees?.role || 'Unset',
            userAccountView: permissions['User Accounts']?.hasAccess || false,
            userAccountViewControl: permissions['User Accounts']?.role || 'Unset',
            dailyReportView: permissions.Reports?.role || 'Unset',
            dailyReportViewControl: permissions.reportDepartment || 'All',
            leaveView: permissions.Leave?.hasAccess || false,
            leaveViewControl: permissions.Leave?.role || 'Unset',
            carBookingView: permissions['Car Booking']?.hasAccess || false,
            carBookingViewControl: permissions['Car Booking']?.role || 'Unset'
        });
    },

    // Add other account-related API methods here as needed
};

export default accountApi;