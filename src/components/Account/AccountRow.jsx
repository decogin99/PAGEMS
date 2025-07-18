import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';

const AccountRow = ({ account, onDeactivate, onPermissions }) => {
    const { darkMode } = useTheme();
    const { user } = useAuth();
    const [imageError, setImageError] = useState(false);


    const hasFullControl = user?.permissions?.userAccountViewControl === 'Full Control';

    // Format date to a readable string
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "2-digit"
        });
    };

    // Generate initials from name
    const getInitials = (name) => {
        return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    };

    return (
        <tr className={`${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'} transition-colors`}>
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                        {account.photo && !imageError ? (
                            <img
                                src={account.photo}
                                alt={account.employeeName}
                                className="h-10 w-10 rounded-full object-cover"
                                onError={() => setImageError(true)}
                            />
                        ) : (
                            <div className="h-10 w-10 bg-[#0054A6] rounded-full flex items-center justify-center text-white text-sm font-semibold">
                                {getInitials(account.employeeName)}
                            </div>
                        )}
                    </div>
                    <div className="ml-4">
                        <div className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            {account.employeeName}
                        </div>
                    </div>
                </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    {account.username}
                </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    {account.departmentSection}
                </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    {formatDate(account.createdDate)}
                </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${account.isActive ? (darkMode ? 'bg-green-800 text-green-100' : 'bg-green-100 text-green-800') : (darkMode ? 'bg-red-800 text-red-100' : 'bg-red-100 text-red-800')}`}>
                    {account.isActive ? 'Active' : 'Inactive'}
                </span>
            </td>
            {hasFullControl && (
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex justify-between space-x-2">
                        <button
                            onClick={() => onDeactivate(account.accountId, account.isActive)}
                            className={`px-3 py-1 ${account.isActive ? (darkMode ? 'text-red-400 hover:bg-gray-800' : 'text-red-600 hover:bg-red-100') : (darkMode ? 'text-green-400 hover:bg-green-800' : 'text-green-600 hover:bg-green-100')} rounded transition-colors`}
                        >
                            {account.isActive ? 'Deactivate' : 'Activate'}
                        </button>
                        <button
                            onClick={() => onPermissions(account.accountId)}
                            className={`px-3 py-1 ${darkMode ? 'text-blue-400 hover:bg-gray-800' : 'text-blue-600 hover:bg-blue-100'} rounded transition-colors`}
                        >
                            Permissions
                        </button>
                    </div>
                </td>
            )}
        </tr>
    );
};

export default AccountRow;