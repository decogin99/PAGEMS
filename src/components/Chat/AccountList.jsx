import React, { useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import chatService from '../../services/chatService';

const AccountList = ({
    showAccountList,
    setShowAccountList,
    accountList,
    setAccountList,
    accountPage,
    setAccountPage,
    isLoadingAccounts,
    setIsLoadingAccounts,
    totalAccountPages,
    setTotalAccountPages,
    handleAccountSelect
}) => {
    const { darkMode } = useTheme();
    const { onlineUsers } = useAuth();

    // Function to fetch account list for chat
    const fetchAccountList = async (page = 1) => {
        setIsLoadingAccounts(true);
        try {
            const response = await chatService.getAccountListForChat(page);
            if (response.success) {
                if (page === 1) {
                    // For first page, replace the list
                    setAccountList(response.data.data);
                } else {
                    // For subsequent pages, append to existing list
                    setAccountList(prevList => [...prevList, ...response.data.data]);
                }
                setTotalAccountPages(response.data.totalPages);
            } else {
                console.error('Failed to fetch account list:', response.message);
            }
        } catch (error) {
            console.error('Error fetching account list:', error);
        } finally {
            setIsLoadingAccounts(false);
        }
    };

    // Function to load more accounts
    const loadMoreAccounts = () => {
        if (accountPage < totalAccountPages && !isLoadingAccounts) {
            const nextPage = accountPage + 1;
            setAccountPage(nextPage);
            fetchAccountList(nextPage);
        }
    };

    // Fetch accounts when component mounts
    useEffect(() => {
        if (showAccountList) {
            fetchAccountList(1);
        }
    }, [showAccountList]);

    if (!showAccountList) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div className="flex items-center justify-center min-h-screen p-4 text-center">
                <div className="fixed inset-0 backdrop-blur-sm bg-opacity-75 transition-opacity" aria-hidden="true" onClick={() => setShowAccountList(false)}></div>
                <div className={`relative inline-block align-middle ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:max-w-lg w-full p-6`}>
                    <div className="flex justify-between items-center mb-4">
                        <h3 className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Select a contact </h3>
                        <button
                            onClick={() => setShowAccountList(false)}
                            className={`p-1 rounded-full ${darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-200 text-gray-500'}`}
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <div className={`max-h-96 -mx-3 overflow-y-auto ${darkMode ? 'custom-scrollbar-dark' : 'custom-scrollbar-light'}`}>
                        {isLoadingAccounts && accountList.length === 0 ? (
                            <div className="flex justify-center items-center py-6">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0054A6]"></div>
                            </div>
                        ) : accountList.length > 0 ? (
                            <div className="space-y-2">
                                {accountList.map(account => (
                                    <div
                                        key={account.accountId}
                                        className={`p-3 rounded-lg cursor-pointer flex items-center gap-3 ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                                        onClick={() => handleAccountSelect(account)}
                                    >
                                        <div className="relative">
                                            {account.photo ? (
                                                <img
                                                    src={account.photo}
                                                    alt={account.employeeName}
                                                    className="w-10 h-10 rounded-full object-cover"
                                                    onError={(e) => {
                                                        e.target.onerror = null;
                                                        e.target.style.display = 'none';
                                                        e.target.nextSibling.style.display = 'flex';
                                                    }}
                                                />
                                            ) : null}
                                            <div className={`${account.photo ? 'hidden' : ''} w-10 h-10 bg-[#0054A6] rounded-full flex items-center justify-center text-white font-medium`}>
                                                {account.employeeName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                                            </div>
                                            {/* Add online status indicator */}
                                            {onlineUsers.has(account.accountId) ? (
                                                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white "></div>
                                            ) : (
                                                <div className="absolute bottom-0 right-0 w-3 h-3 bg-gray-400 rounded-full border-2 border-white "></div>
                                            )}
                                        </div>
                                        <div>
                                            <h4 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{account.employeeName}</h4>
                                            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{account.departmentSection}</p>
                                        </div>
                                    </div>
                                ))}

                                {accountPage < totalAccountPages && (
                                    <div className="pt-2 text-center">
                                        <button
                                            onClick={loadMoreAccounts}
                                            className={`px-4 py-2 text-sm font-medium rounded-md ${isLoadingAccounts ? 'opacity-50 cursor-not-allowed' : ''} ${darkMode ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                                            disabled={isLoadingAccounts}
                                        >
                                            {isLoadingAccounts ? (
                                                <div className="flex items-center space-x-3">
                                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#0054A6]"></div>
                                                    <span>Loading</span>
                                                </div>
                                            ) : 'Load More'}
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className={`py-8 text-center ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                No accounts found
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AccountList;