import apiService from './apiService';

export const employeeApi = {
    fetchEmployeeList: async (page = 1) => {
        return apiService.get('/Employee/getEmployeeList', { page });
    }
    
    // Add other employee-related API methods here
};

export default employeeApi;
