import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const axiosInstance = axios.create({
    baseURL: API_URL,
    withCredentials: true,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

const makeApiRequest = async (apiCall, timeout = 10000) => {
    return Promise.race([
        apiCall,
        new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Request timeout')), timeout)
        )
    ]);
};

const handleNetworkError = (error) => {
    if (error.message === 'Request timeout') {
        console.error('Request timed out.');
        return 'Request timed out.';
    } else if (!navigator.onLine) {
        console.error('No internet connection.');
        return 'No internet connection.';
    } else if (error.code === 'ERR_NETWORK') {
        console.error('Cannot reach the server.');
        return 'Cannot reach the server.';
    } else {
        console.error('An unexpected error occurred:', error);
        return error.response?.data?.message || 'An unexpected error occurred.';
    }
};

class AuthService {
    async login(username, password, rememberMe = false) {
        try {
            const response = await makeApiRequest(
                axiosInstance.post('/api/Auth/login', { 
                    username, 
                    password,
                    rememberMe
                })
            );
            
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
            const errorMessage = error.response?.data?.message 
                || error.response?.statusText 
                || handleNetworkError(error);
            return {
                success: false,
                message: errorMessage
            };
        }
    }

    async logout() {
        try {
            // Remove user from local storage
            localStorage.removeItem('user');
            
            // Optional: Call logout endpoint if available
            // await axiosInstance.post('/api/Auth/logout');
            
            return {
                success: true,
                message: 'Logout successful'
            };
        } catch (error) {
            console.error('Logout error:', error);
            return {
                success: false,
                message: handleNetworkError(error)
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