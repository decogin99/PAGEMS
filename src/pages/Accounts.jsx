import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { accountApi } from '../services/accountService';
import AccountRow from '../components/Account/AccountRow';
import PermissionManager from '../components/Account/PermissionManager';

const Accounts = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterDepartment, setFilterDepartment] = useState('all');
    const [filterStatus, setFilterStatus] = useState('all');
    const { darkMode } = useTheme();
    const { user } = useAuth();

    // State for accounts data
    const [accounts, setAccounts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [totalItems, setTotalItems] = useState(0);

    // Add these new state variables for the confirmation modal
    const [showDeactivateConfirm, setShowDeactivateConfirm] = useState(false);
    const [accountToDeactivate, setAccountToDeactivate] = useState(null);
    const [isDeactivating, setIsDeactivating] = useState(false);
    const [accountStatus, setAccountStatus] = useState(true); // true for active, false for inactive

    // Add these new state variables for the permissions modal
    const [showPermissionsModal, setShowPermissionsModal] = useState(false);
    const [accountToUpdatePermissions, setAccountToUpdatePermissions] = useState(null);
    const [permissionsData, setPermissionsData] = useState(null);

    const hasFullControl = user?.permissions?.activityViewControl === 'Full Control';

    // Function to fetch accounts
    const fetchAccounts = async (page = 1) => {
        setLoading(true);
        setError(null);

        try {
            const response = await accountApi.fetchAccountList(page);

            if (response.success) {
                setAccounts(response.data.data || []);
                setTotalPages(response.data.totalPages || 0);
                setTotalItems(response.data.totalItems || 0);
            } else {
                setError(response.message);
            }
        } catch (err) {
            setError('Failed to fetch accounts');
            console.error('Error fetching accounts:', err);
        } finally {
            setLoading(false);
        }
    };

    // Add this function to handle direct page navigation
    const goToPage = (pageNumber) => {
        setCurrentPage(pageNumber);
        fetchAccounts(pageNumber);
    };

    // Pagination functions
    const nextPage = () => {
        const nextPageNum = currentPage + 1;
        setCurrentPage(nextPageNum);
        fetchAccounts(nextPageNum);
    };

    const prevPage = () => {
        if (currentPage > 1) {
            const prevPageNum = currentPage - 1;
            setCurrentPage(prevPageNum);
            fetchAccounts(prevPageNum);
        }
    };

    // Fetch accounts when component mounts
    useEffect(() => {
        fetchAccounts(1);
    }, []);

    // Get unique departments for filter
    const departments = ['all', ...new Set(accounts.map(account => account.departmentSection))];

    // Filter accounts based on search and filters
    const filteredAccounts = accounts.filter(account => {
        const matchesSearch = account.employeeName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            account.username?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesDepartment = filterDepartment === 'all' || account.departmentSection === filterDepartment;
        const matchesStatus = filterStatus === 'all' ||
            (filterStatus === 'active' && account.isActive) ||
            (filterStatus === 'inactive' && !account.isActive);
        return matchesSearch && matchesDepartment && matchesStatus;
    });

    const handleAddAccount = () => {
        // Implement add account logic
        console.log('Adding new account...');
    };

    // Update the handleDeactivate function to show the confirmation modal
    const handleDeactivate = (accountId, isActive) => {
        setAccountToDeactivate(accountId);
        setAccountStatus(isActive);
        setShowDeactivateConfirm(true);
    };

    // Add these new functions for handling confirmation
    const confirmDeactivate = async () => {
        if (!accountToDeactivate) return;

        setIsDeactivating(true);
        try {
            if (accountStatus) { // If account is active, deactivate it
                const response = await accountApi.deactivateAccount(accountToDeactivate);
                if (response.success) {
                    // Refresh the accounts list
                    fetchAccounts(currentPage);
                } else {
                    setError(response.message || 'Failed to deactivate account');
                }
            } else { // If account is inactive, activate it (if implemented)
                console.log(`Activating account ${accountToDeactivate}...`);
                // Implement activation logic here if needed
            }
        } catch (err) {
            setError(`Failed to ${accountStatus ? 'deactivate' : 'activate'} account`);
            console.error(`Error ${accountStatus ? 'deactivating' : 'activating'} account:`, err);
        } finally {
            setIsDeactivating(false);
            setShowDeactivateConfirm(false);
            setAccountToDeactivate(null);
        }
    };

    const cancelDeactivate = () => {
        setShowDeactivateConfirm(false);
        setAccountToDeactivate(null);
    };

    const handlePermissions = async (accountId) => {
        // Find the account to get current permissions
        const account = accounts.find(acc => acc.accountId === accountId);
        if (account) {
            setAccountToUpdatePermissions(account);
            setShowPermissionsModal(true);

            // Example permission structure based on the image
            // In a real implementation, you would fetch this from the API
            setPermissionsData({
                'Profile': { hasAccess: true, role: '-' },
                'Dashboard': { hasAccess: true, role: '-' },
                'Announcement': { hasAccess: true, role: 'View' },
                'Activities': { hasAccess: true, role: 'View' },
                'Employees': { hasAccess: true, role: 'Full Control' },
                'User Accounts': { hasAccess: true, role: 'Full Control' },
                'Reports': { hasAccess: true, role: 'Admin' },
                'Quotation': { hasAccess: false, role: 'Unset' },
                'Task': { hasAccess: false, role: 'Unset' },
                'Customers': { hasAccess: false, role: 'Unset' },
                'Car Booking': { hasAccess: true, role: 'User' }
            });
        }
    };

    const handleSavePermissions = async (updatedPermissions) => {
        try {
            // In a real implementation, you would call the API to update permissions
            // const response = await accountApi.updatePermissions(accountToUpdatePermissions.accountId, updatedPermissions);

            console.log('Saving permissions for account:', accountToUpdatePermissions.accountId);
            console.log('Updated permissions:', updatedPermissions);

            // Close the modal after successful update
            setShowPermissionsModal(false);
            setAccountToUpdatePermissions(null);
            setPermissionsData(null);

            // You might want to refresh the accounts list here
            // fetchAccounts(currentPage);
        } catch (error) {
            console.error('Error updating permissions:', error);
        }
    };

    const handleCancelPermissions = () => {
        setShowPermissionsModal(false);
        setAccountToUpdatePermissions(null);
        setPermissionsData(null);
    };

    return (
        <div className={`fixed inset-0 flex flex-col ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
            <div className={`${isSidebarOpen ? 'backdrop-blur-sm' : ''} transition-all duration-300`}>
                <Navbar onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />
            </div>
            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

            {/* Add the Deactivate Confirmation Modal */}
            {showDeactivateConfirm && (
                <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                    <div className="flex items-center justify-center min-h-screen p-4 text-center">
                        <div className="fixed inset-0 backdrop-blur-sm bg-opacity-75 transition-opacity" aria-hidden="true"></div>
                        <div className={`relative inline-block align-middle ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:max-w-lg w-full p-6`}>
                            <div className="text-center">
                                <h3 className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
                                    Confirm {accountStatus ? 'Deactivation' : 'Activation'}
                                </h3>
                                <p className={`${darkMode ? 'text-gray-300' : 'text-gray-500'} mb-6`}>
                                    {accountStatus
                                        ? 'Are you sure you want to deactivate this account? The user will be logged out immediately.'
                                        : 'Are you sure you want to activate this account?'}
                                </p>
                                <div className="flex justify-center space-x-4">
                                    <button
                                        onClick={cancelDeactivate}
                                        className={`px-4 py-2 rounded-lg ${darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                                        disabled={isDeactivating}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={confirmDeactivate}
                                        className={`px-4 py-2 ${accountStatus ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'} text-white rounded-lg transition-colors flex items-center justify-center min-w-[100px]`}
                                        disabled={isDeactivating}
                                    >
                                        {isDeactivating ? (
                                            <>
                                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                {accountStatus ? 'Deactivating...' : 'Activating...'}
                                            </>
                                        ) : (
                                            accountStatus ? 'Deactivate' : 'Activate'
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <main className={`flex-1 overflow-y-auto lg:pl-64 mt-16 ${darkMode ? 'custom-scrollbar-dark' : 'custom-scrollbar-light'}`}>
                <div className="p-5">
                    <div className="max-w-7xl mx-auto">
                        {/* Header Section */}
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">
                            <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Accounts ({totalItems})</h1>
                            <div className="flex items-center space-x-4">
                                {hasFullControl && (
                                    <button className="px-4 py-2 bg-[#0054A6] text-white rounded-lg hover:bg-[#004080] transition-colors w-full sm:w-auto flex items-center justify-center gap-2">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                        </svg>
                                        Add Account
                                    </button>
                                )}
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
                                            placeholder="Search accounts..."
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
                                        {departments.map(dept => (
                                            <option key={dept} value={dept}>
                                                {dept === 'all' ? 'All Departments' : dept}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="w-full sm:w-48">
                                    <select
                                        className={`w-full h-10 px-4 py-2 ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300 text-gray-900'} border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0054A6] focus:border-transparent`}
                                        value={filterStatus}
                                        onChange={(e) => setFilterStatus(e.target.value)}
                                    >
                                        <option value="all">All Status</option>
                                        <option value="active">Active</option>
                                        <option value="inactive">Inactive</option>
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
                                <span>Loading accounts...</span>
                            </div>
                        )}

                        {error && !loading && (
                            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
                                <strong className="font-bold">Error! </strong>
                                <span className="block sm:inline">{error}</span>
                            </div>
                        )}

                        {/* Accounts Table */}
                        {!loading && !error && (
                            <>
                                <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-sm overflow-hidden`}>
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full">
                                            <thead className={`bg-[#0054A6]`}>
                                                <tr>
                                                    <th scope="col" className={`px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider`}>
                                                        User
                                                    </th>
                                                    <th scope="col" className={`px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider`}>
                                                        Username
                                                    </th>
                                                    <th scope="col" className={`px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider`}>
                                                        Department
                                                    </th>
                                                    <th scope="col" className={`px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider`}>
                                                        Created Date
                                                    </th>
                                                    <th scope="col" className={`px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider`}>
                                                        Status
                                                    </th>
                                                    <th scope="col" className={`px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider`}>
                                                        Actions
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className={`${darkMode ? 'bg-gray-800 divide-gray-700' : 'bg-white divide-gray-200'} divide-y`}>
                                                {filteredAccounts.map((account) => (
                                                    <AccountRow
                                                        key={account.accountId}
                                                        account={account}
                                                        onDeactivate={handleDeactivate}
                                                        onPermissions={handlePermissions}
                                                    />
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                {/* Pagination */}
                                {accounts.length > 0 && (
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
                                            {currentPage < totalPages - 2 && totalPages > 1 && (
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

                                {accounts.length === 0 && !loading && (
                                    <div className={`text-center ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                                        No accounts found!
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </main>

            {/* Add the Permissions Modal */}
            {showPermissionsModal && accountToUpdatePermissions && permissionsData && (
                <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                    <div className="flex items-center justify-center min-h-screen p-4 text-center">
                        <div className="fixed inset-0 backdrop-blur-sm bg-opacity-75 transition-opacity" aria-hidden="true"></div>
                        <div className={`relative -mr-4 inline-block align-middle ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:max-w-4xl w-full`}>
                            <PermissionManager
                                accountInfo={{
                                    name: accountToUpdatePermissions.employeeName,
                                    username: accountToUpdatePermissions.username
                                }}
                                permissions={permissionsData}
                                onSave={handleSavePermissions}
                                onCancel={handleCancelPermissions}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Accounts;
