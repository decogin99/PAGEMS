import apiService from './apiService';

class AuthService {
    async login(username, password, rememberMe = false) {
        const response = await apiService.post('/Auth/login', {
            username,
            password,
            rememberMe
        });

        if (response.success && response.data) {
            // Store the entire user info object
            localStorage.setItem('user', JSON.stringify(response.data.userInfo || response.data));
        }
        return response;
    }

    async fetchAccountPermissions() {
        const response = await apiService.get('/Account/getPermissions');

        if (response.success && response.data) {
            const currentUser = this.getCurrentUser();
            if (currentUser) {
                // The permissions are directly in response.data now, not in response.data.data
                currentUser.permissions = response.data;
                localStorage.setItem('user', JSON.stringify(currentUser));

                return {
                    success: true,
                    data: currentUser,
                    message: 'Permissions updated successfully'
                };
            }
        }
        return response;
    }

    async checkAccountStatus() {
        // Get the current user's account ID
        const currentUser = this.getCurrentUser();
        if (!currentUser || !currentUser.accountId) {
            return { success: false, message: 'No user logged in' };
        }

        // Call the API to check if the account is still active
        return await apiService.get(`/Account/checkStatus/${currentUser.accountId}`);
    }

    async logout() {
        try {
            // Remove user from local storage
            localStorage.removeItem('user');

            // Optional: Call logout endpoint if available
            // await apiService.post('/api/Auth/logout');

            return {
                success: true,
                message: 'Logout successful'
            };
        } catch (error) {
            console.error('Logout error:', error);
            return {
                success: false,
                message: error.message || 'Logout failed'
            };
        }
    }

    getCurrentUser() {
        try {
            const user = localStorage.getItem('user');
            return user ? JSON.parse(user) : null;
        } catch (error) {
            console.error('Error getting current user:', error);
            return null;
        }
    }

    isAuthenticated() {
        return !!this.getCurrentUser();
    }
}

export default new AuthService();