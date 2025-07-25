import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

function ChatBox({showMobileChat, selectedChat, handleNewChat, handleBackToList}) {
    const { darkMode } = useTheme();
    const [imageErrors, setImageErrors] = useState({});
    const { onlineUsers } = useAuth();

    return(
        <div className={`w-full md:flex-1 flex flex-col ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} h-full ${showMobileChat ? 'flex' : 'hidden md:flex'} transition-all duration-300`}>
            {selectedChat ? (
                <div className={`w-full md:flex-1 flex flex-col ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} h-full ${showMobileChat ? 'flex' : 'hidden md:flex'} transition-all duration-300`}>
                    {/* Chat Header - Sticky */}
                    <div className={`sticky top-0 z-10 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-y`}>
                    <div className="p-4 flex items-center space-x-3">
                                <button
                                    onClick={handleBackToList}
                                    className={`md:hidden p-2 ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} rounded-full`}
                                >
                                    <svg className={`w-5 h-5 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                    </svg>
                                </button>
                                <div className="relative">
                                    {selectedChat.photo && !imageErrors[selectedChat.id] ? (
                                        <img
                                            src={selectedChat.photo}
                                            alt={selectedChat.name}
                                            className="w-10 h-10 rounded-full object-cover"
                                            onError={() => setImageErrors(prev => ({ ...prev, [selectedChat.id]: true }))}
                                        />
                                    ) : (
                                        <div className="w-10 h-10 bg-[#0054A6] rounded-full flex items-center justify-center text-white text-sm font-semibold">
                                            {selectedChat.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <h2 className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{selectedChat.name}</h2>
                                    {!selectedChat.isGroup && (
                                        <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                            <div className='flex items-center space-x-1'>
                                                {onlineUsers.has(selectedChat.accountId) ? (
                                                    <>
                                                        <div className={`w-3 h-3 bg-green-500 rounded-full border-2 ${darkMode ? 'border-gray-800' : 'border-white'}`}></div>
                                                        <span>Online</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <div className={`w-3 h-3 bg-gray-400 rounded-full border-2 ${darkMode ? 'border-gray-800' : 'border-white'}`}></div>
                                                        <span>Offline</span>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                    </div>
                    
                </div>
            ) : (
                <div className={`w-full pt-4 md:pt-0 md:flex-1 flex flex-col ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} h-full ${showMobileChat ? 'flex' : 'hidden md:flex'} transition-all duration-300`}>
                        {/* Empty state - Select a chat */}
                        <div className="flex-1 flex flex-col items-center justify-center p-4">
                            <div className={`mb-4 p-4 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-12 h-12 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
                                </svg>
                            </div>
                            <h2 className={`text-xl font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Select a chat to start messaging</h2>
                            <p className={`text-center max-w-md ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                <span>Choose an existing conversation from the list</span>
                                <br></br>
                                <span>Or</span>
                                <br></br>
                                <span>
                                    Start a new chat by clicking the "New Message" button
                                </span>
                            </p>
                            <button
                                onClick={handleNewChat}
                                className="mt-6 px-4 py-2 bg-[#0054A6] text-white rounded-lg hover:bg-[#004080] transition-colors flex items-center gap-2"
                            >
                                <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                </svg>
                                New Message
                            </button>
                        </div>
                    </div>
            )}
        </div>
    )
}

export default ChatBox;