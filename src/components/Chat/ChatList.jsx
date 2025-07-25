import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

function ChatList({fetchChatList, chatList, isLoadingChatList, loadingChatListError, showMobileChat, handleNewChat, selectedChatId}){
    const { darkMode } = useTheme();
    const [searchTerm, setSearchTerm] = useState('');
    const [imageErrors, setImageErrors] = useState({});
    const { onlineUsers } = useAuth();

    const filteredChats = chatList.filter(chat =>
        chat.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleChatSelect = (chat) => {
        console.log(chat)
    }
    
    useEffect(() => {
        fetchChatList(true);
    }, []);
    
    return (
        <div className={`w-full md:w-80 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-r flex flex-col ${showMobileChat ? 'hidden md:flex' : 'flex'}`}>

            {/* Chat List Header */}
            <div className={`p-4 border-b ${darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'}`}>
                <div className="flex justify-between items-center mb-3">
                    <h2 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Messages</h2>
                    <button
                        onClick={handleNewChat}
                        className="p-2 bg-[#0054A6] text-white rounded-full hover:bg-[#004080] transition-colors"
                        title="New Message">
                            <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                            </svg>
                    </button>
                </div>
                <div className="relative">
                    <input
                        id='search'
                        name='search'
                        type="text"
                        autoComplete='off'
                        className={`w-full pl-10 pr-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0054A6] focus:border-transparent ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500'} border`}
                        placeholder="Search messages..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <svg className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-400'} absolute left-3 top-3`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
            </div>

            {/* Chat List */}
            <div className={`flex-1 overflow-y-auto ${darkMode ? 'custom-scrollbar-dark' : 'custom-scrollbar-light'}`}>
                {isLoadingChatList ? (
                     <div className="flex justify-center items-center p-4">
                     <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#0054A6]"></div>
                 </div>
                ) : loadingChatListError ? (
                    <div className="flex flex-col items-center justify-center p-4 text-center">
                        <div className="mb-2 text-red-500">
                            <svg className="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                        <p className={`text-red-500 font-medium mb-1`}>Error Loading Chats</p>
                        <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} text-sm`}>{loadingChatListError}</p>
                        <button
                            onClick={() => fetchChatList(true)}
                            className="mt-3 px-4 py-2 bg-[#0054A6] text-white rounded-lg hover:bg-[#004080] transition-colors text-sm"
                        >
                            Try Again
                        </button>
                    </div>
                ) : filteredChats.length > 0 ? (
                    filteredChats.map(chat => (
                        <div 
                            key={chat.id}
                            className={`p-4 cursor-pointer transition-colors flex items-start space-x-3 ${selectedChatId === chat.id
                            ? (darkMode ? 'bg-gray-700' : 'bg-gray-200')
                            : ''} ${darkMode
                                ? 'hover:bg-gray-700'
                                : 'hover:bg-gray-200'}`}
                            onClick={() => handleChatSelect(chat)}>
                            <div className="relative">
                                {chat.photo && !imageErrors[chat.id] ? (
                                    <img
                                        src={chat.photo}
                                        alt={chat.name}
                                        className="w-12 h-12 rounded-full object-cover"
                                        onError={() => setImageErrors(prev => ({ ...prev, [chat.id]: true }))}
                                    />
                                ) : (
                                    <div className="w-12 h-12 bg-[#0054A6] rounded-full flex items-center justify-center text-white font-medium">
                                        {chat.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                                    </div>
                                )}
                                {!chat.isGroup && onlineUsers.has(chat.accountId) && (
                                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-1">
                                    <h3 className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} truncate`}>{chat.name}</h3>
                                    <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'} ml-2`}>{chat.time}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'} truncate`}>{chat.lastMessage}</p>
                                    {chat.unread > 0 && (
                                        <div className="bg-[#0054A6] text-white text-xs font-medium rounded-full w-5 h-5 flex items-center justify-center ml-2 flex-shrink-0">
                                            {chat.unread}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="flex flex-col items-center justify-center p-4 text-center">
                        <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>No chats found</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default ChatList;