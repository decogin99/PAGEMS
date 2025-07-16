import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import EmployeeCard from '../components/Employee/EmployeeCard';
import { useTheme } from '../context/ThemeContext';
import { employeeApi } from '../services/employeeService';

const Employees = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterDutyPlace, setFilterDutyPlace] = useState('all');
    const [filterDepartment, setFilterDepartment] = useState('all');
    const { darkMode } = useTheme();

    // Replace context with local state
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);

    // Function to fetch employees
    // Add these state variables at the top with your other state declarations
    const [totalPages, setTotalPages] = useState(0);
    const [totalItems, setTotalItems] = useState(0);

    // Update your fetchEmployees function to store pagination metadata
    const fetchEmployees = async (page = 1) => {
        setLoading(true);
        setError(null);

        try {
            const response = await employeeApi.fetchEmployeeList(page);

            if (response.success) {
                setEmployees(response.data.data || []);
                setTotalPages(response.data.totalPages || 0);
                setTotalItems(response.data.totalItems || 0);
            } else {
                setError(response.message);
            }
        } catch (err) {
            setError('Failed to fetch employees');
            console.error('Error fetching employees:', err);
        } finally {
            setLoading(false);
        }
    };

    // Add this function to handle direct page navigation
    const goToPage = (pageNumber) => {
        setCurrentPage(pageNumber);
        fetchEmployees(pageNumber);
    };

    // Pagination functions
    const nextPage = () => {
        const nextPageNum = currentPage + 1;
        setCurrentPage(nextPageNum);
        fetchEmployees(nextPageNum);
    };

    const prevPage = () => {
        if (currentPage > 1) {
            const prevPageNum = currentPage - 1;
            setCurrentPage(prevPageNum);
            fetchEmployees(prevPageNum);
        }
    };

    // Fetch employees when component mounts
    useEffect(() => {
        fetchEmployees(1);
    }, []);

    const placeOnDuty = ['all', 'D.I.S', 'P.A.G'];
    const dutyPlaces = ['all', 'Head Office', 'Factory'];

    const handleExportExcel = () => {
        // Implement Excel export logic
        console.log('Exporting to Excel...');
    };

    // Filter employees based on search and filters
    const filteredEmployees = employees.filter(employee => {
        const matchesSearch = employee.employeeName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (employee.email?.toLowerCase().includes(searchTerm.toLowerCase()) || '');
        const matchesDutyPlace = filterDutyPlace === 'all' || employee.dutyPlace === filterDutyPlace;
        const matchesDepartment = filterDepartment === 'all' || employee.department === filterDepartment;
        return matchesSearch && matchesDutyPlace && matchesDepartment;
    });

    // Map API response to match the expected format for EmployeeCard
    const mappedEmployees = filteredEmployees.map(emp => ({
        id: emp.employeeId,
        name: emp.employeeName,
        department: emp.department,
        dutyPlace: emp.dutyPlace,
        placeOnDuty: emp.placeOnDuty,
        position: emp.position,
        joinedDate: emp.joinedDate,
        employeeStatus: emp.employeeStatus
    }));

    return (
        <div className={`fixed inset-0 flex flex-col ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
            <div className={`${isSidebarOpen ? 'backdrop-blur-sm' : ''} transition-all duration-300`}>
                <Navbar onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />
            </div>
            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

            <main className={`flex-1 overflow-y-auto lg:pl-64 mt-16 ${darkMode ? 'custom-scrollbar-dark' : 'custom-scrollbar-light'}`}>
                <div className="p-5">
                    <div className="max-w-7xl mx-auto">
                        {/* Header Section */}
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">
                            <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Employees ({totalItems})</h1>
                            <div className="flex items-center space-x-4">
                                <button
                                    onClick={handleExportExcel}
                                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors w-full sm:w-auto flex items-center justify-center gap-2"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                    </svg>
                                    Export
                                </button>
                                <button className="px-4 py-2 bg-[#0054A6] text-white rounded-lg hover:bg-[#004080] transition-colors w-full sm:w-auto flex items-center justify-center gap-2">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                    Add Employee
                                </button>
                            </div>
                        </div>

                        {/* Search and Filter Section */}
                        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-4 rounded-lg shadow-sm mb-6`}>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <div className="flex-1">
                                    <div className="relative">
                                        <input
                                            type="text"
                                            className={`w-full h-10 pl-10 pr-4 py-2 ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'border-gray-300 text-gray-900'} border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0054A6] focus:border-transparent`}
                                            placeholder="Search employees..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                        />
                                        <svg className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-400'} absolute left-3 top-2.5`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                    </div>
                                </div>
                                <div className="w-full sm:w-48">
                                    <select
                                        className={`w-full h-10 px-4 py-2 ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300 text-gray-900'} border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0054A6] focus:border-transparent`}
                                        value={filterDepartment}
                                        onChange={(e) => setFilterDepartment(e.target.value)}
                                    >
                                        {placeOnDuty.map(dept => (
                                            <option key={dept} value={dept}>
                                                {dept === 'all' ? 'All' : dept}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="w-full sm:w-48">
                                    <select
                                        name='dutyPlace'
                                        className={`w-full h-10 px-4 py-2 ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300 text-gray-900'} border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0054A6] focus:border-transparent`}
                                        value={filterDutyPlace}
                                        onChange={(e) => setFilterDutyPlace(e.target.value)}
                                    >
                                        {dutyPlaces.map(duty => (
                                            <option key={duty} value={duty}>
                                                {duty === 'all' ? 'Duty Place' : duty}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Loading and Error States */}
                        {loading && (
                            <div className={`flex justify-center items-center ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                                <svg className="animate-spin h-8 w-8 mr-3" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                <span>Loading employees...</span>
                            </div>
                        )}

                        {error && !loading && (
                            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
                                <strong className="font-bold">Error! </strong>
                                <span className="block sm:inline">{error}</span>
                            </div>
                        )}

                        {/* Employees Grid */}
                        {!loading && !error && (
                            <>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                                    {mappedEmployees.map((employee) => (
                                        <EmployeeCard key={employee.id} employee={employee} />
                                    ))}
                                </div>

                                {/* Pagination */}
                                {employees.length > 0 && (
                                    <div className="flex flex-col items-center mt-6 space-y-3">

                                        <div className="flex justify-center space-x-1">
                                            <button
                                                onClick={prevPage}
                                                disabled={currentPage === 1}
                                                className={`px-3 py-1 rounded-md ${currentPage === 1 ? 'bg-gray-300 cursor-not-allowed' : 'bg-[#0054A6] hover:bg-[#004080]'} text-white transition-colors`}
                                            >
                                                &lt;
                                            </button>

                                            {/* First page */}
                                            {currentPage > 3 && (
                                                <button
                                                    onClick={() => goToPage(1)}
                                                    className={`px-3 py-1 rounded-md ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-700'} hover:bg-[#0054A6] hover:text-white transition-colors`}
                                                >
                                                    1
                                                </button>
                                            )}

                                            {/* Ellipsis if needed */}
                                            {currentPage > 4 && (
                                                <span className={`px-3 py-1 ${darkMode ? 'text-white' : 'text-gray-700'}`}>...</span>
                                            )}

                                            {/* Page numbers */}
                                            {[...Array(totalPages)].map((_, index) => {
                                                const pageNumber = index + 1;
                                                // Show current page and 1 page before and after
                                                if (
                                                    pageNumber === currentPage ||
                                                    pageNumber === currentPage - 1 ||
                                                    pageNumber === currentPage + 1
                                                ) {
                                                    return (
                                                        <button
                                                            key={pageNumber}
                                                            onClick={() => goToPage(pageNumber)}
                                                            className={`px-3 py-1 rounded-md ${pageNumber === currentPage ? 'bg-[#0054A6] text-white' : darkMode ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-700'} hover:bg-[#0054A6] hover:text-white transition-colors`}
                                                        >
                                                            {pageNumber}
                                                        </button>
                                                    );
                                                }
                                                return null;
                                            })}

                                            {/* Ellipsis if needed */}
                                            {currentPage < totalPages - 3 && (
                                                <span className={`px-3 py-1 ${darkMode ? 'text-white' : 'text-gray-700'}`}>...</span>
                                            )}

                                            {/* Last page */}
                                            {currentPage < totalPages - 2 && (
                                                <button
                                                    onClick={() => goToPage(totalPages)}
                                                    className={`px-3 py-1 rounded-md ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-700'} hover:bg-[#0054A6] hover:text-white transition-colors`}
                                                >
                                                    {totalPages}
                                                </button>
                                            )}

                                            <button
                                                onClick={nextPage}
                                                disabled={currentPage === totalPages}
                                                className={`px-3 py-1 rounded-md ${currentPage === totalPages ? 'bg-gray-300 cursor-not-allowed' : 'bg-[#0054A6] hover:bg-[#004080]'} text-white transition-colors`}
                                            >
                                                &gt;
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {employees.length === 0 && !loading && (
                                    <div className={`text-center ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                                        No employees found!
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Employees;