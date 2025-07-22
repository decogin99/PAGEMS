import React, { useState, useEffect, useRef } from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import AccountList from '../components/Chat/AccountList';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import chatService from '../services/chatService';
import signalRService from '../services/signalRService';

const Chat = () => {
    const { darkMode } = useTheme();
    const messagesRef = useRef(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [selectedChat, setSelectedChat] = useState(null);
    const [message, setMessage] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [showMobileChat, setShowMobileChat] = useState(false);
    const [showAccountList, setShowAccountList] = useState(false);
    const [accountList, setAccountList] = useState([]);
    const [accountPage, setAccountPage] = useState(1);
    const [isLoadingAccounts, setIsLoadingAccounts] = useState(false);
    const [totalAccountPages, setTotalAccountPages] = useState(1);
    const [chats, setChats] = useState([]);
    const [isLoadingChats, setIsLoadingChats] = useState(false);
    const [loadingChatsError, setLoadingChatsError] = useState(false);
    const [imageErrors, setImageErrors] = useState({});

    const [selectedChatId, setSelectedChatId] = useState(null);

    const [messages, setMessages] = useState({});
    const [isLoadingMessages, setIsLoadingMessages] = useState(false);
    const [loadingMessagesError, setLoadingMessagesError] = useState(null);
    const [currentMessagePage, setCurrentMessagePage] = useState(1);
    const [shouldScrollToBottom, setShouldScrollToBottom] = useState(true);

    const { onlineUsers, user } = useAuth();
    const selectedChatIdRef = useRef(null);

    // Function to fetch chat list
    const fetchChatList = async (showLoading, restoreSelectedChat = true) => {
        if (showLoading)
            setIsLoadingChats(showLoading);

        setLoadingChatsError(null)

        try {
            const response = await chatService.getChatList();
            if (response.success && response.data) {
                // Transform the API response to match our component's expected format
                const formattedChats = response.data.map(chat => ({
                    id: chat.roomId,
                    accountId: chat.isGroup ? null : chat.otherAccountId,
                    name: chat.isGroup ? chat.groupName : chat.otherUsername,
                    lastMessage: chat.lastMessage || '',
                    time: chat.lastMessageTime ? new Date(chat.lastMessageTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '',
                    unread: chat.unreadCount || 0,
                    isGroup: chat.isGroup,
                    photo: chat.isGroup ? chat.groupPhoto : chat.otherPhoto,
                    messages: [] // We'll fetch messages separately when a chat is selected
                }));
                setChats(formattedChats);

                // Only try to restore the selected chat if requested
                if (restoreSelectedChat) {
                    // Try to restore selected chat after fetching chat list
                    const savedChatId = localStorage.getItem('selectedChatId');
                    const savedAccountId = localStorage.getItem('selectedAccountId');

                    // Only try to restore a selected chat if there was one previously
                    // or if this is an explicit user action (not an automatic refresh)
                    if (selectedChat || showLoading) {
                        // In the fetchChatList function, modify the code where it restores the selected chat
                        if (savedChatId) {
                            // First try by chat ID
                            const savedChat = formattedChats.find(chat => chat.id.toString() === savedChatId);
                            if (savedChat) {
                                setSelectedChat(savedChat);
                                selectedChatIdRef.current = savedChat.id;
                                setSelectedChatId(savedChat.id); // Add this line to update the visual selection
                                setShowMobileChat(true);

                                // Mark chat as read on the server if it has unread messages
                                if (savedChat.unread > 0) {
                                    chatService.markChatAsRead(savedChat.id)
                                        .catch(error => console.error('Error marking chat as read:', error));

                                    // Also update the chat in the list to show 0 unread count
                                    const updatedChat = { ...savedChat, unread: 0 };
                                    setChats(prevChats =>
                                        prevChats.map(c => c.id === savedChat.id ? updatedChat : c)
                                    );
                                }

                                // Fetch messages for the restored chat
                                fetchChatMessages(savedChat.id, 1, false);
                                return; // Exit if we found a match
                            }
                        }

                        if (savedAccountId) {
                            // If chat ID didn't work, try by account ID
                            const savedChatByAccount = formattedChats.find(chat =>
                                !chat.isGroup && chat.accountId && chat.accountId.toString() === savedAccountId);
                            if (savedChatByAccount) {
                                setSelectedChat(savedChatByAccount);
                                selectedChatIdRef.current = savedChatByAccount.id;
                                setSelectedChatId(savedChatByAccount.id); // Add this line to update the visual selection
                                setShowMobileChat(true);

                                // Mark chat as read on the server if it has unread messages
                                if (savedChatByAccount.unread > 0) {
                                    chatService.markChatAsRead(savedChatByAccount.id)
                                        .catch(error => console.error('Error marking chat as read:', error));

                                    // Also update the chat in the list to show 0 unread count
                                    const updatedChat = { ...savedChatByAccount, unread: 0 };
                                    setChats(prevChats =>
                                        prevChats.map(c => c.id === savedChatByAccount.id ? updatedChat : c)
                                    );
                                }

                                // Fetch messages for the restored chat
                                fetchChatMessages(savedChatByAccount.id, 1, false);
                                // Update the saved chat ID to match the server's ID
                                localStorage.setItem('selectedChatId', savedChatByAccount.id.toString());
                            }
                        }
                    }
                }
            }
            else {
                setLoadingChatsError(response.message || 'Failed to fetch chat list');
                setChats([]);
            }
        } catch (err) {
            console.error('Error fetching activities:', err);
            setLoadingChatsError('An unexpected error occurred while fetching chat');
            setChats([]);
        } finally {
            setIsLoadingChats(false);
        }
    };

    // Set up SignalR connection and event handlers
    useEffect(() => {
        // Initialize SignalR connection for NewMessage
        const unsubscribeSentMessage = signalRService.on('NewMessage', (newMessage) => {
            // Refresh chat list when sent message
            try {
                const normalizedData = {
                    roomId: newMessage.roomId,
                    message: newMessage.message,
                    sentBy: newMessage.sentBy,
                    sentTo: newMessage.sentTo,
                    sentAt: newMessage.sentAt
                };

                // Skip adding the message if it was sent by the current user
                // Only update the chat list entry
                const isSentByCurrentUser = normalizedData.sentBy === user.accountId;

                if (!isSentByCurrentUser) {
                    setMessages(prevMessages => {
                        const roomMessages = prevMessages[normalizedData.roomId] || [];
                        return {
                            ...prevMessages,
                            [normalizedData.roomId]: [...roomMessages, {
                                id: Date.now(), // Temporary ID
                                text: normalizedData.message,
                                sent: normalizedData.sentBy === user.accountId,
                                time: new Date(normalizedData.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                            }]
                        };
                    });
                }

                // In the NewMessage event handler
                setChats(prevChats => {
                    // First check if this chat exists in the list
                    const chatExists = prevChats.some(chat => chat.id === normalizedData.roomId);

                    if (!chatExists) {
                        // Don't change the selected chat when refreshing the chat list
                        // Store the current selectedChatIdRef value
                        const currentSelectedChatId = selectedChatIdRef.current;

                        // Refresh the chat list without changing the selected chat
                        fetchChatList(false, false).then(() => {
                            // Restore the selectedChatIdRef after the chat list is refreshed
                            selectedChatIdRef.current = currentSelectedChatId;
                        });
                        return prevChats;
                    }

                    // Check if this is the selected chat
                    const isSelectedChat = selectedChatIdRef.current === normalizedData.roomId;

                    // Only mark as read if this is the selected chat AND the user is actively viewing it
                    // (not just a temporary chat that was created but not yet used)
                    if (isSelectedChat && normalizedData.sentBy !== user.accountId) {
                        // Only mark as read if this chat has a real server ID (not a temporary one)
                        const selectedChat = prevChats.find(chat => chat.id === normalizedData.roomId);
                        const isTemporaryChat = !selectedChat.lastMessage && selectedChat.id > 1000000000000;

                        if (!isTemporaryChat) {
                            chatService.markChatAsRead(normalizedData.roomId)
                                .catch(error => console.error('Error marking chat as read:', error));
                        }
                    }

                    return prevChats.map(chat => {
                        if (chat.id === normalizedData.roomId) {
                            // Check if this is the selected chat AND not a temporary chat
                            const isRealSelectedChat = isSelectedChat && chat.lastMessage;

                            // Don't increment unread count for messages sent by the current user
                            if (normalizedData.sentBy === user.accountId) {
                                return {
                                    ...chat,
                                    lastMessage: normalizedData.message,
                                    time: new Date(normalizedData.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                                    unread: chat.unread || 0
                                };
                            }

                            return {
                                ...chat,
                                lastMessage: normalizedData.message,
                                time: new Date(normalizedData.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                                // Only set unread to 0 if it's the selected chat, otherwise increment
                                unread: isRealSelectedChat ? 0 : (chat.unread || 0) + 1
                            };
                        }
                        return chat;
                    });
                });
            }
            catch (err) {
                console.error('Error processing new message:', err);
            }
        });

        // Clean up SignalR connections when component unmounts
        return () => {
            unsubscribeSentMessage();
        };
    }, [selectedChat, user.accountId]); // Add user.accountId to dependencies

    useEffect(() => {
        fetchChatList(true)
    }, [])

    // Function to fetch chat messages
    const fetchChatMessages = async (chatRoomId, page = 1, showLoading) => {
        if (!chatRoomId) return;

        if (showLoading)
            setIsLoadingMessages(showLoading);

        setLoadingMessagesError(null);
        setShouldScrollToBottom(page === 1);

        try {
            const response = await chatService.getChatMessageList(chatRoomId, page);

            if (response.success && response.data) {
                // Format messages for display
                const formattedMessages = response.data.map(msg => ({
                    id: msg.messageId,
                    text: msg.content,
                    sent: msg.sentBy === user.accountId,
                    time: new Date(msg.sentDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    isRead: msg.isRead
                }));

                // Update messages state - prepend earlier messages when page > 1
                setMessages(prevMessages => {
                    const currentMessages = prevMessages[chatRoomId] || [];

                    if (page === 1) {
                        // First page - replace existing messages
                        return {
                            ...prevMessages,
                            [chatRoomId]: formattedMessages
                        };
                    } else {
                        // Later pages - prepend to existing messages
                        return {
                            ...prevMessages,
                            [chatRoomId]: [...formattedMessages, ...currentMessages]
                        };
                    }
                });

                setCurrentMessagePage(page);
            } else {
                setLoadingMessagesError(response.message || 'Failed to fetch messages');
            }
        } catch (err) {
            console.error('Error fetching messages:', err);
            setLoadingMessagesError('An unexpected error occurred while fetching messages');
        } finally {
            setIsLoadingMessages(false);
        }
    };

    // Function to handle new chat button click
    const handleNewChat = () => {
        setShowAccountList(true);
        setAccountPage(1); // Reset to first page when opening
    };

    // Function to handle account selection
    const handleAccountSelect = (account) => {
        // Check if chat with this account already exists
        const existingChat = chats.find(chat => !chat.isGroup && chat.accountId === account.accountId);

        if (existingChat) {
            setSelectedChat(existingChat);
            // Update the selectedChatIdRef to match the selected chat
            selectedChatIdRef.current = existingChat.id;
            // Add this line to update the selectedChatId
            setSelectedChatId(existingChat.id);
            // Save account ID instead of chat ID to localStorage
            localStorage.setItem('selectedAccountId', account.accountId.toString());
        } else {
            // Create a new chat with this account
            const newChat = {
                id: Date.now(), // Temporary ID until we get one from the server
                accountId: account.accountId,
                name: account.employeeName,
                lastMessage: '',
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                unread: 0,
                isGroup: false,
                photo: account.photo || '',
                messages: []
            };

            // Add to chats array (in a real app, you'd save this to your backend)
            setChats(prevChats => [...prevChats, newChat]);
            setSelectedChat(newChat);
            // Update the selectedChatIdRef to match the new chat
            selectedChatIdRef.current = newChat.id;
            // Add this line to update the selectedChatId
            setSelectedChatId(newChat.id);

            console.log(newChat.id)
        }


        setShowMobileChat(true);
        setShowAccountList(false);
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!message.trim() || !selectedChat) return;

        try {
            // Call the API to send the message
            const response = await chatService.sendMessage(
                selectedChat.accountId,
                message.trim()
            );

            if (response.success) {
                // Add new message to the selected chat (optimistic update)
                const newMessage = {
                    id: selectedChat.messages.length + 1,
                    text: message,
                    sent: true,
                    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                };

                // Create the updated chat object
                const updatedChat = {
                    ...selectedChat,
                    messages: [...selectedChat.messages, newMessage],
                    lastMessage: message,
                    time: newMessage.time
                };

                // Update the chats array
                setChats(prevChats => {
                    // First find and update the chat with the new message
                    const updatedChats = prevChats.map(chat =>
                        chat.id === selectedChat.id ? updatedChat : chat
                    );

                    // Then sort the chats to bring the most recently messaged chat to the top
                    const sortedChats = updatedChats.sort((a, b) => {
                        // If either chat doesn't have a time, keep its current position
                        if (!a.time || !b.time) return 0;

                        // If the chat we just updated is in the comparison, it should be first
                        if (a.id === selectedChat.id) return -1;
                        if (b.id === selectedChat.id) return 1;

                        // Otherwise compare by the stored time
                        return 0; // Keep existing order for other chats
                    });

                    return sortedChats;
                });

                // Make sure to update selectedChatIdRef to maintain the selection
                selectedChatIdRef.current = updatedChat.id;

                // Add these lines to update localStorage
                localStorage.setItem('selectedChatId', updatedChat.id.toString());
                if (!updatedChat.isGroup && updatedChat.accountId) {
                    localStorage.setItem('selectedAccountId', updatedChat.accountId.toString());
                }

                // Find the updated chat in the sorted chats array after the state update
                // Use a small timeout to ensure the chats state has been updated
                setTimeout(() => {
                    const currentChat = chats.find(chat => chat.id === updatedChat.id);
                    if (currentChat) {
                        setSelectedChat(currentChat);
                        // Add this line to update the selectedChatId
                        setSelectedChatId(currentChat.id);
                    }
                }, 50);
                setMessages(prevMessages => ({
                    ...prevMessages,
                    [selectedChat.id]: [...(prevMessages[selectedChat.id] || []), newMessage]
                }));

                // No need for the setTimeout anymore
                setMessage('');
                setShouldScrollToBottom(true); // Ensure we scroll to the bottom
            } else {
                console.error('Failed to send message:', response.message);
                // You could show an error notification here
            }
        } catch (error) {
            console.error('Error sending message:', error);
            // You could show an error notification here
        }
    };

    // Function to handle chat selection
    const handleChatSelect = (chat) => {
        // Update the selected chat with unread count reset to 0
        const updatedChat = { ...chat, unread: 0 };
        setSelectedChat(updatedChat);
        // Make sure to update selectedChatId
        setSelectedChatId(updatedChat.id);
        setShowMobileChat(true);

        // Save selected chat ID to localStorage
        localStorage.setItem('selectedChatId', chat.id.toString());

        // Also save the account ID if this is a direct chat
        if (!chat.isGroup && chat.accountId) {
            localStorage.setItem('selectedAccountId', chat.accountId.toString());
        }

        // Update the chat in the chats list
        setChats(prevChats =>
            prevChats.map(c => c.id === chat.id ? updatedChat : c)
        );

        // Mark chat as read on the server
        if (chat.unread > 0) {
            chatService.markChatAsRead(chat.id)
                .catch(error => console.error('Error marking chat as read:', error));
        }

        // Only fetch messages if this is not a newly created chat without a server ID
        // Check if the ID is a temporary one (created with Date.now())
        const isTemporaryChat = !chat.lastMessage && chat.id > 1000000000000; // Date.now() values are large numbers

        if (!isTemporaryChat) {
            // Fetch messages for the selected chat
            fetchChatMessages(chat.id, 1, true);
        } else {
            // For new chats without messages, just set an empty messages array
            setMessages(prevMessages => ({
                ...prevMessages,
                [chat.id]: []
            }));
            setLoadingMessagesError(null);
        }
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

    // Add this useEffect
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        if (selectedChat && shouldScrollToBottom) {
            scrollToBottom();
        }
    }, [messages, selectedChat, shouldScrollToBottom]);

    return (
        <div className={`fixed inset-0 flex flex-col ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
            <div className={`${isSidebarOpen ? 'backdrop-blur-sm' : ''} transition-all duration-300`}>
                <Navbar onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />
            </div>
            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

            <div className={`flex-1 flex lg:pl-64 mt-16 overflow-y-auto ${darkMode ? 'custom-scrollbar-dark' : 'custom-scrollbar-light'}`}>
                {/* Chat List Section */}
                <div className={`w-full md:w-80 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-r flex flex-col ${showMobileChat ? 'hidden md:flex' : 'flex'}`}>
                    {/* Search Header */}
                    <div className={`p-4 border-b ${darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'}`}>
                        <div className="flex justify-between items-center mb-3">
                            <h2 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Messages</h2>
                            <button
                                onClick={handleNewChat}
                                className="p-2 bg-[#0054A6] text-white rounded-full hover:bg-[#004080] transition-colors"
                                title="New Message"
                            >
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

                    {/* Account List Modal Component */}
                    <AccountList
                        showAccountList={showAccountList}
                        setShowAccountList={setShowAccountList}
                        accountList={accountList}
                        setAccountList={setAccountList}
                        accountPage={accountPage}
                        setAccountPage={setAccountPage}
                        isLoadingAccounts={isLoadingAccounts}
                        setIsLoadingAccounts={setIsLoadingAccounts}
                        totalAccountPages={totalAccountPages}
                        setTotalAccountPages={setTotalAccountPages}
                        handleAccountSelect={handleAccountSelect}
                    />

                    {/* Chat List - Scrollable */}
                    <div className={`flex-1 overflow-y-auto ${darkMode ? 'custom-scrollbar-dark' : 'custom-scrollbar-light'}`}>
                        {isLoadingChats ? (
                            <div className="flex justify-center items-center p-4">
                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#0054A6]"></div>
                            </div>
                        ) : loadingChatsError ? (
                            <div className="flex flex-col items-center justify-center p-4 text-center">
                                <div className="mb-2 text-red-500">
                                    <svg className="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                    </svg>
                                </div>
                                <p className={`text-red-500 font-medium mb-1`}>Error Loading Chats</p>
                                <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} text-sm`}>{loadingChatsError}</p>
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
                                    className={`p-4 cursor-pointer transition-colors ${selectedChatId === chat.id
                                        ? (darkMode ? 'bg-gray-700' : 'bg-gray-200')
                                        : ''} ${darkMode
                                            ? 'hover:bg-gray-700'
                                            : 'hover:bg-gray-200'}`}
                                    onClick={() => handleChatSelect(chat)}
                                >
                                    <div className="flex items-center gap-3">
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
                                </div>
                            ))
                        ) : (
                            <div className="flex flex-col items-center justify-center p-4 text-center">
                                <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>No chats found</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Chat Area */}
                {selectedChat ? (
                    <div className={`w-full md:flex-1 flex flex-col ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} h-full ${showMobileChat ? 'flex' : 'hidden md:flex'} ${isSidebarOpen ? 'backdrop-blur-sm' : ''} transition-all duration-300`}>

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

                        {/* Messages - Scrollable Between Header & Input */}
                        <div ref={messagesRef} className={`flex-1 overflow-y-auto p-4 space-y-4 scroll-pb-32 ${darkMode ? 'custom-scrollbar-dark' : 'custom-scrollbar-light'}`}>
                            {isLoadingMessages && currentMessagePage === 1 ? (
                                <div className="flex justify-center items-center p-4">
                                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#0054A6]"></div>
                                </div>
                            ) : loadingMessagesError ? (
                                <div className="flex flex-col items-center justify-center p-4 text-center">
                                    <div className="mb-2 text-red-500">
                                        <svg className="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                        </svg>
                                    </div>
                                    <p className={`text-red-500 font-medium mb-1`}>Error Loading Messages</p>
                                    <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} text-sm`}>{loadingMessagesError}</p>
                                    <button
                                        onClick={() => fetchChatMessages(selectedChat.id, 1, true)}
                                        className="mt-3 px-4 py-2 bg-[#0054A6] text-white rounded-lg hover:bg-[#004080] transition-colors text-sm"
                                    >
                                        Try Again
                                    </button>
                                </div>
                            ) : (
                                <>
                                    {/* Load More Messages Button */}
                                    {messages[selectedChat?.id]?.length >= 20 * currentMessagePage && (
                                        <div className="flex justify-center mb-4">
                                            <button
                                                onClick={() => fetchChatMessages(selectedChat.id, currentMessagePage + 1, false)}
                                                className={`px-4 py-2 rounded-lg text-sm ${isLoadingMessages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-opacity-80'} ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-800'}`}
                                                disabled={isLoadingMessages}
                                            >
                                                {isLoadingMessages ? 'Loading...' : 'Load Earlier Messages'}
                                            </button>
                                        </div>
                                    )}

                                    {/* Messages */}
                                    {(messages[selectedChat?.id] || []).map((msg, index) => (
                                        <div key={msg.id || index} className={`flex ${msg.sent ? 'justify-end' : 'justify-start'}`}>
                                            <div className={`max-w-[70%] rounded-lg p-3 ${msg.sent
                                                ? 'bg-[#0054A6] text-white'
                                                : (darkMode ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-900')}`}>
                                                <p className="text-sm">{msg.text}</p>
                                                <div className='flex justify-between'>
                                                    <p className={`text-xs mt-1 ${msg.sent
                                                        ? 'text-blue-100'
                                                        : (darkMode ? 'text-gray-400' : 'text-gray-500')}`}>{msg.time}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    <div ref={messagesEndRef} />
                                </>
                            )}
                        </div>

                        {/* Message Input - Sticky */}
                        <div className={`sticky bottom-0 p-4 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-t z-10`}>
                            <form onSubmit={handleSendMessage} className="flex space-x-4">
                                <input
                                    id='message'
                                    name='message'
                                    type="text"
                                    autoComplete='off'
                                    className={`flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0054A6] focus:border-transparent ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'}`}
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
                    <div className={`w-full pt-4 md:pt-0 md:flex-1 flex flex-col ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} h-full ${showMobileChat ? 'flex' : 'hidden md:flex'} ${isSidebarOpen ? 'backdrop-blur-sm' : ''} transition-all duration-300`}>
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
        </div>
    );
};

export default Chat;
