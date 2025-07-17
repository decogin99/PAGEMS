import apiService from './apiService';

class AuthService {
    async login(username, password, rememberMe = false) {
        try {
            const response = await apiService.post('/Auth/login', { 
                username, 
                password,
                rememberMe
            });
            
            if (response?.data) {
                localStorage.setItem('user', JSON.stringify(response.data));
                return {
                    success: true,
                    data: response.data,
                    message: 'Login successful'
                };
            }
            return {
                success: false,
                message: 'Invalid response from server'
            };
        } catch (error) {
            console.error('Login error:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'An unexpected error occurred'
            };
        }
    }

    async fetchAccountPermissions() {
        try {
            const user = this.getCurrentUser();
            if (!user?.accountId) return null;

            const response = await apiService.get(`/Account/getPermissions?accountId=${user.accountId}`);
            if (response?.data) {
                // Update the user's permissions in localStorage
                const updatedUser = { ...user, permissions: response.data };
                localStorage.setItem('user', JSON.stringify(updatedUser));
                return response.data;
            }
            return null;
        } catch (error) {
            console.error('Error fetching permissions:', error);
            return null;
        }
    }

    async logout() {
        localStorage.removeItem('user');
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