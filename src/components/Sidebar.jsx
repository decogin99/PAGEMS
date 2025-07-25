import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
// import pagLogo from '../assets/PAG_Icon_Transparent.png';

const Sidebar = ({ isOpen, onClose, forceOpenReportDropdown }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const { darkMode, toggleDarkMode } = useTheme();
    const { user, logout, onlineUsers, connectionStatus } = useAuth();
    const [reportDropdownOpen, setReportDropdownOpen] = useState(false);
    const [imageError, setImageError] = useState(false);

    // Effect to handle forced open dropdown from Report_Software component
    useEffect(() => {
        if (forceOpenReportDropdown) {
            setReportDropdownOpen(true);
        }
    }, [forceOpenReportDropdown]);

    const permissions = user?.permissions || {};
    const photo = user?.employeePhoto || null;
    const employeeName = user?.employeeName || 'User';
    const username = user?.username || '';

    const userId = user?.accountId || '';
    // Update isOnline to check both onlineUsers and connection status
    const isOnline = userId && onlineUsers.has(userId) && connectionStatus === 'Connected';

    // Generate initials from name
    const getInitials = (name) => {
        return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    };

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    // Define report views
    const reportViews = [
        { name: 'BOD', path: '/report/bod', component: 'Report_BOD' },
        { name: 'HR&Admin', path: '/report/hradmin', component: 'Report_HRAdmin' },
        { name: 'Finance', path: '/report/finance', component: 'Report_Finance' },
        { name: 'Marketing', path: '/report/marketing', component: 'Report_Marketing' },
        { name: 'Design', path: '/report/design', component: 'Report_Design' },
        { name: 'IT', path: '/report/it', component: 'Report_IT' },
        { name: 'Software', path: '/report/software', component: 'Report_Software' },
        { name: 'Factory', path: '/report/factory', component: 'Report_Factory' },
    ];

    // Filter report views based on permissions
    const filteredReportViews = permissions.dailyReportView === 'All'
        ? reportViews
        : reportViews.filter(view => {
            return permissions.dailyReportView === view.name;
        });

    const isReportsDropdown = permissions.dailyReportView === 'All';

    const navigation = [
        {
            name: 'Dashboard',
            path: '/dashboard',
            permissionKey: 'dashboardView',
            icon: (
                <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />
                </svg>
            )
        },
        {
            name: 'Announcements',
            path: '/announcements',
            permissionKey: 'announcementView',
            icon: (
                <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 0 1-2.25 2.25M16.5 7.5V18a2.25 2.25 0 0 0 2.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 0 0 2.25 2.25h13.5M6 7.5h3v3H6v-3Z" />
                </svg>
            )
        },
        {
            name: 'Activities',
            path: '/activities',
            permissionKey: 'activityView',
            icon: (
                <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                </svg>
            )
        },
        {
            name: 'Employees',
            path: '/employees',
            permissionKey: 'employeeView',
            icon: (
                <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
                </svg>
            )
        },
        {
            name: 'Accounts',
            path: '/accounts',
            permissionKey: 'userAccountView',
            icon: (
                <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                </svg>

            )
        },
        {
            name: 'Reports',
            permissionKey: 'dailyReportView',
            // Line 118 (in the navigation array)
            path: isReportsDropdown ? undefined : (permissions.dailyReportView ? `/report/${permissions.dailyReportView.replace('&', '')}` : '/dashboard'),
            icon: (
                <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V12Zm0 3h.008v.008H6.75V18Z" />
                </svg>
            ),
            hasDropdown: isReportsDropdown,
            isDropdownOpen: isReportsDropdown ? reportDropdownOpen : false,
            toggleDropdown: isReportsDropdown ? () => setReportDropdownOpen(!reportDropdownOpen) : undefined,
            dropdownItems: isReportsDropdown ? filteredReportViews : []
        },
        {
            name: 'CarBooking',
            path: '/carbooking',
            permissionKey: 'carBookingView',
            icon: (
                <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                </svg>
            )
        },
        {
            name: 'Leave',
            path: '/leave',
            permissionKey: 'leaveView',
            icon: (
                <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
                </svg>
            )
        },
        {
            name: 'Settings',
            path: '/settings',
            permissionKey: 'userAccountView',
            icon: (
                <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                </svg>
            )
        }
    ];

    // Filter navigation items based on user permissions
    const filteredNavigation = navigation.filter(item => {
        if (!permissions) return false;

        // Always show Profile
        if (item.name === 'Profile') return true;

        // Special case for Reports which uses department-based permissions
        if (item.permissionKey === 'dailyReportView') {
            return permissions[item.permissionKey] !== undefined &&
                permissions[item.permissionKey] !== null &&
                permissions[item.permissionKey] !== false;
        }

        // For all other permissions
        return permissions[item.permissionKey] === true ||
            permissions[item.permissionKey] === 'View' ||
            permissions[item.permissionKey] === 'Full Control';
    });

    return (
        <>
            <div className={`fixed inset-0 left-0 z-30 w-64 transform transition-transform duration-300 ease-in-out lg:translate-x-0 shadow-lg ${isOpen ? 'translate-x-0' : '-translate-x-full'} ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-r`}>
                <div className="flex flex-col h-full">
                    <div className="flex items-center justify-center h-[4.1rem] px-4 border-gray-200 bg-[#0054A6]">
                        {/* <img src={pagLogo} alt="PAG Logo" className="h-8 bg-white rounded" /> */}
                        <span className="font-semibold text-white">
                            <span className='text-xl tracking-widest'>PAG EMS</span>
                        </span>
                    </div>

                    {/* User Profile Section */}
                    <div className={`px-4 py-3 border-b ${darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'}`}>
                        <div className="flex items-center space-x-3">
                            <div className='relative'>
                                {photo && !imageError ? (
                                    <img
                                        src={photo}
                                        alt={employeeName}
                                        className="h-10 w-10 rounded-full object-cover"
                                        onError={() => setImageError(true)}
                                    />
                                )
                                    :
                                    (
                                        <div className="h-10 w-10 bg-[#0054A6] rounded-full flex items-center justify-center text-white text-sm font-semibold">
                                            <span>{getInitials(employeeName)}</span>
                                        </div>
                                    )}

                                {/* In the JSX where the online status indicator is rendered: */}
                                {/* Online status indicator */}
                                {isOnline ? (
                                    <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 rounded-full border-2 border-white"></div>
                                ) : (
                                    <div className="absolute bottom-0 right-0 h-3 w-3 bg-gray-400 rounded-full border-2 border-white"></div>
                                )}
                            </div>
                            <div className="flex flex-col">
                                <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>{employeeName}</span>
                                <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Account : {username}</span>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar List */}
                    <div className={`flex-1 overflow-y-auto sidebar-no-scrollbar ${darkMode ? 'custom-scrollbar-dark' : 'custom-scrollbar-light'}`}>
                        <nav className="px-4 py-3 space-y-1">
                            {filteredNavigation.map((item) => {
                                const isActive = location.pathname === item.path ||
                                    (item.hasDropdown && item.dropdownItems.some(subItem => location.pathname === subItem.path));

                                return (
                                    <div key={item.name}>
                                        {item.hasDropdown ? (
                                            <div className="space-y-1">
                                                <button
                                                    onClick={item.toggleDropdown}
                                                    className={`flex items-center justify-between w-full px-4 py-2.5 text-md font-medium rounded-lg transition-colors ${isActive
                                                        ? 'bg-[#0054A6] text-white'
                                                        : darkMode
                                                            ? 'text-gray-300 hover:bg-[#0054A6] hover:text-white'
                                                            : 'text-gray-600 hover:bg-[#0054A6] hover:text-white'
                                                        }`}
                                                >
                                                    <div className="flex items-center">
                                                        {item.icon}
                                                        <span className="ml-3">{item.name}</span>
                                                    </div>
                                                    <svg
                                                        className={`w-5 h-5 transition-transform ${item.isDropdownOpen ? 'transform rotate-180' : ''}`}
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        stroke="currentColor"
                                                    >
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                    </svg>
                                                </button>

                                                {item.isDropdownOpen && (
                                                    <div className="pl-4 space-y-1">
                                                        {item.dropdownItems.map((subItem) => {
                                                            const isSubActive = location.pathname === subItem.path;
                                                            return (
                                                                <Link
                                                                    key={subItem.name}
                                                                    to={subItem.path}
                                                                    className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors ${isSubActive
                                                                        ? 'bg-[#0054A6] text-white'
                                                                        : darkMode
                                                                            ? 'text-gray-300 hover:bg-[#0054A6] hover:text-white'
                                                                            : 'text-gray-600 hover:bg-[#0054A6] hover:text-white'
                                                                        }`}
                                                                    onClick={() => onClose()}
                                                                >
                                                                    <svg fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-4 mr-2">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                                                                    </svg>

                                                                    {subItem.name}
                                                                </Link>
                                                            );
                                                        })}
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <Link
                                                to={item.path}
                                                className={`flex items-center px-4 py-2.5 text-md font-medium rounded-lg transition-colors ${isActive
                                                    ? 'bg-[#0054A6] text-white'
                                                    : darkMode
                                                        ? 'text-gray-300 hover:bg-[#0054A6] hover:text-white'
                                                        : 'text-gray-600 hover:bg-[#0054A6] hover:text-white'
                                                    }`}
                                                onClick={() => onClose()}
                                            >
                                                {item.icon}
                                                <span className="ml-3">{item.name}</span>
                                            </Link>
                                        )}
                                    </div>
                                );
                            })}
                        </nav>
                    </div>

                    <div className={`px-4 py-3 space-y-1 border-t ${darkMode ? 'border-gray-700' : 'border-gray-300'}`}>
                        <button
                            onClick={toggleDarkMode}
                            className={`flex items-center w-full p-2 text-md font-medium rounded-lg ${darkMode ? 'text-gray-300 hover:bg-[#0054A6] hover:text-white' : 'text-gray-600 hover:bg-[#0054A6] hover:text-white'}`}
                        >
                            {darkMode ? (
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                            ) : (
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                                </svg>
                            )}
                            <span className="ml-3">{darkMode ? 'Light Mode' : 'Dark Mode'}</span>
                        </button>
                        <button
                            onClick={handleLogout}
                            className={`flex items-center w-full p-2 text-md font-medium rounded-lg ${darkMode ? 'text-gray-300 hover:bg-[#0054A6] hover:text-white' : 'text-gray-600 hover:bg-[#0054A6] hover:text-white'}`}>
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            <span className="ml-3">Logout</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Overlay for mobile */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-20 backdrop-blur-xs bg-black/10 lg:hidden"
                    onClick={onClose}
                />
            )}
        </>
    );
};

export default Sidebar;