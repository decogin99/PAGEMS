import React from 'react';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ onMenuClick }) => {
    const navigate = useNavigate();
    return (
        <nav className="bg-white border-b border-gray-200 fixed w-full z-30 shadow">
            <div className="lg:pl-60 transition-all duration-300">
                <div className="flex items-center justify-between h-16 px-4 sm:pl-6 lg:pl-8">
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={onMenuClick}
                            className="p-2 rounded-md text-gray-600 hover:text-[#0054A6] hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#0054A6]"
                        >
                            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                        <div className="flex items-center">
                            <span className="text-gray-700 font-semibold">IT Department</span>
                        </div>
                    </div>

                    <div className="flex items-center">
                        <div className="flex items-center space-x-4">
                            <div className="relative">
                                <button
                                    onClick={() => navigate('/PAGEMS/messages')}
                                    className="p-2 text-gray-600 hover:text-white rounded-full hover:bg-[#0054A6]">
                                    <svg className="h-4.5 w-4.5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z" />
                                    </svg>
                                </button>

                                {/* Red Dot Notification */}
                                <span className="absolute top-1 right-1 block h-2.5 w-2.5 rounded-full bg-red-600 ring-2 ring-white"></span>
                            </div>

                            <button className="p-2 text-gray-600 hover:text-white rounded-full hover:bg-[#0054A6]">
                                <svg className="h-4.5 w-4.5 md:h-6 md:w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                </svg>
                            </button>

                            <div className="flex items-center">
                                <button className="group flex items-center space-x-2 p-2 rounded-full md:hover:bg-[#0054A6]">
                                    <div className="h-8 w-8 rounded-full bg-[#0054A6] flex items-center justify-center text-white font-medium 
                                    md:group-hover:bg-white md:group-hover:text-[#0054A6] 
                                    group-hover:bg-[#004080] group-hover:text-white 
                                    transition-colors me-0 sm:me-2">
                                        <span className='text-xs'>TH</span>
                                    </div>
                                    <span className="hidden md:block text-sm font-medium text-gray-700 group-hover:text-white transition-colors pe-1">
                                        Thu Htoo Aung
                                    </span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;