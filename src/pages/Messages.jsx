import React, { useState, useEffect, useRef } from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

const Messages = () => {
    const messagesRef = useRef(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [selectedChat, setSelectedChat] = useState(null);
    const [message, setMessage] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [showMobileChat, setShowMobileChat] = useState(false);

    // Sample data - replace with actual data
    const chats = [
        {
            id: 1,
            name: 'John Doe',
            lastMessage: 'Hey, how are you?',
            time: '10:30 AM',
            unread: 2,
            online: true,
            messages: [
                { id: 1, text: 'Hey, how are you?', sent: false, time: '10:30 AM' },
                { id: 2, text: 'I\'m good, thanks! How about you?', sent: true, time: '10:31 AM' },
                { id: 3, text: 'I\'m doing well. Can we discuss the project?', sent: false, time: '10:32 AM' },
                { id: 4, text: 'Hey, you okay?', sent: false, time: '10:33 AM' },
                { id: 5, text: 'Reply me', sent: false, time: '10:33 AM' },
                { id: 6, text: 'Hello', sent: false, time: '10:33 AM' },
                { id: 7, text: 'This is scrollable', sent: false, time: '10:33 AM' },
                { id: 8, text: 'Web developer', sent: false, time: '10:33 AM' },
                { id: 9, text: 'What are you', sent: false, time: '10:33 AM' },
            ]
        },
        {
            id: 2,
            name: 'Jane Smith',
            lastMessage: 'The meeting is at 2 PM',
            time: '9:15 AM',
            unread: 0,
            online: false,
            messages: [
                { id: 1, text: 'Hi Jane, about the meeting today', sent: true, time: '9:14 AM' },
                { id: 2, text: 'The meeting is at 2 PM', sent: false, time: '9:15 AM' },
            ]
        }
    ];

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!message.trim() || !selectedChat) return;

        // Add new message to the selected chat
        const newMessage = {
            id: selectedChat.messages.length + 1,
            text: message,
            sent: true,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        selectedChat.messages.push(newMessage);
        setMessage('');
    };

    const handleChatSelect = (chat) => {
        setSelectedChat(chat);
        setShowMobileChat(true);
    };

    const handleBackToList = () => {
        setShowMobileChat(false);
    };

    const filteredChats = chats.filter(chat =>
        chat.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    useEffect(() => {
        const handleFocus = () => {
            document.body.style.overflow = 'hidden';
        };
        const handleBlur = () => {
            document.body.style.overflow = '';
        };

        const input = document.querySelector('input');
        if (input) {
            input.addEventListener('focus', handleFocus);
            input.addEventListener('blur', handleBlur);
        }

        return () => {
            if (input) {
                input.removeEventListener('focus', handleFocus);
                input.removeEventListener('blur', handleBlur);
            }
        };
    }, []);

    useEffect(() => {
        if (messagesRef.current) {
            messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
        }
    }, [selectedChat, message]);

    return (
        <div className="fixed inset-0 flex flex-col">
            <div className={`${isSidebarOpen ? 'backdrop-blur-sm' : ''} transition-all duration-300`}>
                <Navbar onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />
            </div>
            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

            <div className="flex-1 flex lg:pl-64 mt-16 overflow-y-auto">
                {/* Chat List Section */}
                <div className={`w-full md:w-80 bg-white border-r border-gray-200 flex flex-col ${showMobileChat ? 'hidden md:flex' : 'flex'}`}>
                    {/* Search Header */}
                    <div className="p-4 border-b border-gray-200 bg-white">
                        <div className="relative">
                            <input
                                type="text"
                                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0054A6] focus:border-transparent"
                                placeholder="Search messages..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <svg className="w-5 h-5 text-gray-400 absolute left-3 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                    </div>

                    {/* Chat List - Scrollable */}
                    <div className="flex-1 overflow-y-auto">
                        {filteredChats.map(chat => (
                            <div
                                key={chat.id}
                                className={`p-4 hover:bg-gray-200 cursor-pointer transition-colors ${selectedChat?.id === chat.id ? 'bg-gray-200' : ''}`}
                                onClick={() => handleChatSelect(chat)}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="relative">
                                        <div className="w-12 h-12 bg-[#0054A6] rounded-full flex items-center justify-center text-white font-medium">
                                            {chat.name.split(' ').map(n => n[0]).join('')}
                                        </div>
                                        {chat.online && (
                                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between mb-1">
                                            <h3 className="text-sm font-semibold text-gray-900 truncate">{chat.name}</h3>
                                            <span className="text-xs text-gray-500 ml-2">{chat.time}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <p className="text-sm text-gray-500 truncate">{chat.lastMessage}</p>
                                            {chat.unread > 0 && (
                                                <div className="bg-[#0054A6] text-white text-xs font-medium rounded-full w-5 h-5 flex items-center justify-center ml-2 flex-shrink-0">
                                                    {chat.unread}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Chat Area */}
                {selectedChat ? (
                    <div className={`w-full md:flex-1 flex flex-col bg-gray-50 h-full ${showMobileChat ? 'flex' : 'hidden md:flex'} ${isSidebarOpen ? 'backdrop-blur-sm' : ''} transition-all duration-300`}>

                        {/* Chat Header - Sticky */}
                        <div className="sticky top-0 z-10 bg-white border-y border-gray-200">
                            <div className="p-4 flex items-center space-x-3">
                                <button
                                    onClick={handleBackToList}
                                    className="md:hidden p-2 hover:bg-gray-100 rounded-full"
                                >
                                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                    </svg>
                                </button>
                                <div className="relative">
                                    <div className="w-10 h-10 bg-[#0054A6] rounded-full flex items-center justify-center text-white text-lg font-semibold">
                                        {selectedChat.name.split(' ').map(n => n[0]).join('')}
                                    </div>
                                    {selectedChat.online && (
                                        <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white"></div>
                                    )}
                                </div>
                                <div>
                                    <h2 className="text-lg font-medium text-gray-900">{selectedChat.name}</h2>
                                    <p className="text-sm text-gray-500">
                                        {selectedChat.online ? 'Online' : 'Offline'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Messages - Scrollable Between Header & Input */}
                        <div ref={messagesRef} className="flex-1 overflow-y-auto p-4 space-y-4 scroll-pb-32">
                            {selectedChat.messages.map(msg => (
                                <div key={msg.id} className={`flex ${msg.sent ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[70%] rounded-lg p-3 ${msg.sent ? 'bg-[#0054A6] text-white' : 'bg-gray-200 text-gray-900'}`}>
                                        <p className="text-sm">{msg.text}</p>
                                        <div className='flex justify-between'>
                                            <p className={`text-xs mt-1 ${msg.sent ? 'text-blue-100' : 'text-gray-500'}`}>{msg.time}</p>
                                            <p className={`text-xs mt-1`}>{msg.sent &&
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4 text-green-500 ml-3">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                                </svg>

                                            }</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Message Input - Sticky */}
                        <div className="sticky bottom-0 p-4 bg-white border-t border-gray-200 z-10">
                            <form onSubmit={handleSendMessage} className="flex space-x-4">
                                <input
                                    type="text"
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0054A6] focus:border-transparent"
                                    placeholder="Type a message..."
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                />
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-[#0054A6] text-white rounded-lg hover:bg-[#004080] transition-colors flex items-center justify-center"
                                    disabled={!message.trim()}
                                >
                                    <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
                                    </svg>
                                </button>
                            </form>
                        </div>
                    </div>

                ) : (
                    <div className={`w-full pt-4 md:pt-0 md:flex-1 flex flex-col bg-gray-50 h-full ${showMobileChat ? 'flex' : 'hidden md:flex'} ${isSidebarOpen ? 'backdrop-blur-sm' : ''} transition-all duration-300`}>
                        <div className="flex-1 flex items-center justify-center">
                            <div className="text-center">
                                <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                </svg>
                                <h3 className="text-lg font-medium text-gray-900">Select a chat to start messaging</h3>
                                <p className="text-gray-500 mt-1">Choose from your existing conversations</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Messages;