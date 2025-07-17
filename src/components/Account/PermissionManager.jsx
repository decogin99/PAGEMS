import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';

const PermissionManager = ({ accountInfo, permissions, onSave, onCancel }) => {
    const { darkMode } = useTheme();
    const [permissionData, setPermissionData] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [reportDepartment, setReportDepartment] = useState('All');

    // Initialize permission data when component mounts or permissions change
    useEffect(() => {
        if (permissions) {
            setPermissionData(permissions);
        }
    }, [permissions]);

    // Handle toggle change for access switches
    const handleToggleChange = (key) => {
        // Don't allow toggling Profile or Dashboard
        if (key === 'Profile' || key === 'Reports') return;

        setPermissionData(prev => ({
            ...prev,
            [key]: {
                ...prev[key],
                hasAccess: !prev[key]?.hasAccess
            }
        }));
    };

    // Handle role selection change
    const handleRoleChange = (key, value) => {
        setPermissionData(prev => ({
            ...prev,
            [key]: {
                ...prev[key],
                role: value
            }
        }));
    };

    // Handle report department change
    const handleReportDepartmentChange = (value) => {
        setPermissionData(prev => ({
            ...prev,
            Reports: {
                ...prev.Reports,
                department: value
            }
        }));
    };

    // Handle save button click
    const handleSave = async () => {
        setIsLoading(true);
        try {
            // Include reportDepartment in the saved data
            const dataToSave = {
                ...permissionData
            };
            
            await onSave(dataToSave);
        } catch (error) {
            console.error('Error saving permissions:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Determine which options to show based on the key (page name)
    const getRoleOptions = (key) => {
        if (key === 'Reports') {
            return [
                <option key="unset" value="Unset">Unset</option>,
                <option key="admin" value="Admin">Admin</option>,
                <option key="user" value="User">User</option>
            ];
        } else {
            return [
                <option key="unset" value="Unset">Unset</option>,
                <option key="view" value="View">View</option>,
                <option key="fullcontrol" value="Full Control">Full Control</option>
            ];
        }
    };

    // Check if the page should have a select dropdown
    const shouldHaveSelect = (key) => {
        return key !== 'Profile' && key !== 'Dashboard';
    };

    // Get department options for Reports
    const getReportDepartmentOptions = () => {
        return [
            <option key="all" value="All">All</option>,
            <option key="bod" value="BOD">BOD</option>,
            <option key="hradmin" value="HR & Admin">HR & Admin</option>,
            <option key="finance" value="Finance">Finance</option>,
            <option key="marketing" value="Marketing">Marketing</option>,
            <option key="design" value="Design">Design</option>,
            <option key="it" value="IT">IT</option>
        ];
    };

    return (
        <div className={`p-6 ${darkMode ? 'bg-gray-800 text-white border-gray-700' : 'bg-white text-gray-800 border-gray-300'} rounded-lg shadow-lg border-1`}>
            <div className="mb-6">
                <h2 className="text-xl font-medium mb-5">Permission for <span className='font-bold'>{accountInfo?.name}</span> (Username: <span className='font-bold'>{accountInfo?.username}</span>)</h2>
                <div className="grid grid-cols-3 gap-4 font-bold text-sm mb-4">
                    <div>Pages</div>
                    <div className="text-center">View Access</div>
                    <div className="text-center">Role</div>
                </div>
                <div className="space-y-4">
                    {Object.entries(permissionData).map(([key, value]) => (
                        <div key={key} className="grid grid-cols-3 gap-4 items-center">
                            <div className="text-sm">{key}</div>
                            {key === 'Reports' ? (
                                <div className="col-span-2 grid grid-cols-2 gap-4">
                                    <select
                                        className={`w-full p-2 rounded-md border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                                        value={value?.department || 'All'}
                                        onChange={(e) => handleReportDepartmentChange(e.target.value)}
                                    >
                                        {getReportDepartmentOptions()}
                                    </select>
                                    <select
                                        className={`w-full p-2 rounded-md border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                                        value={value?.role || 'Unset'}
                                        onChange={(e) => handleRoleChange(key, e.target.value)}
                                    >
                                        {getRoleOptions(key)}
                                    </select>
                                </div>
                            ) : (
                                <>
                                    <div className="flex justify-center">
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                className="sr-only peer"
                                                checked={key === 'Profile' ? true : (value?.hasAccess || false)}
                                                onChange={() => handleToggleChange(key)}
                                                disabled={key === 'Profile'}
                                            />
                                            <div className={`w-11 h-6 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0054A6]`}></div>
                                        </label>
                                    </div>
                                    <div>
                                        {!shouldHaveSelect(key) ? (
                                            <div className={`w-full p-2 rounded-md text-center ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-500'}`}>
                                                -
                                            </div>
                                        ) : (
                                            <select
                                                className={`w-full p-2 rounded-md border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} ${!value?.hasAccess && 'opacity-50 cursor-not-allowed'}`}
                                                value={value?.role || 'Unset'}
                                                onChange={(e) => handleRoleChange(key, e.target.value)}
                                                disabled={!value?.hasAccess}
                                            >
                                                {getRoleOptions(key)}
                                            </select>
                                        )}
                                    </div>
                                </>
                            )}
                        </div>
                    ))}
                </div>
            </div>
            <div className="flex justify-end space-x-4">
                <button
                    onClick={onCancel}
                    className={`px-4 py-2 rounded-lg ${darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                    disabled={isLoading}
                >
                    Cancel
                </button>
                <button
                    onClick={handleSave}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center justify-center min-w-[120px]"
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Saving...
                        </>
                    ) : 'Save Changes'}
                </button>
            </div>
        </div>
    );
};

export default PermissionManager;