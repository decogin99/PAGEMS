import React, { useState, useEffect, useRef } from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import AccountList from '../components/Chat/AccountList';
import ChatList from '../components/Chat/ChatList';
import ChatBox from '../components/Chat/ChatBox';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useChat } from '../context/ChatContext';
import chatService from '../services/chatService';
import signalRService from '../services/signalRService';

function Chat() {
    const { darkMode } = useTheme();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const [showAccountList, setShowAccountList] = useState(false);
    const [accountList, setAccountList] = useState([]);
    const [accountPage, setAccountPage] = useState(1);
    const [isLoadingAccounts, setIsLoadingAccounts] = useState(false);
    const [totalAccountPages, setTotalAccountPages] = useState(1);

    const [chatList, setChatList] = useState([]);
    const [isLoadingChatList, setIsLoadingChatList] = useState(false);
    const [loadingChatListError, setLoadingChatListError] = useState(false);
    const [showMobileChat, setShowMobileChat] = useState(false);

    const [selectedChat, setSelectedChat] = useState(null);
    const [selectedChatId, setSelectedChatId] = useState(null);
    const selectedChatIdRef = React.useRef(null);

    const messagesRef = useRef(null);
    const [message, setMessage] = useState('');
    const [messageList, setMessageList] = useState({});
    const [isLoadingMessageList, setIsLoadingMessageList] = useState(false);
    const [loadingMessageListError, setLoadingMessageListError] = useState(null);
    const [currentMessagePage, setCurrentMessagePage] = useState(1);
    const [shouldScrollToBottom, setShouldScrollToBottom] = useState(true);

    const [sendMessageError, setSendMessageError] = useState(null);

    const { calculateTotalUnread } = useChat();
    const { user } = useAuth();

    const formatChatTime = (utcTimeString) => {
        if (!utcTimeString) return '';

        // Convert UTC time to local time
        // Add 'Z' suffix if it's missing to ensure it's treated as UTC
        const timeString = utcTimeString.endsWith('Z') ? utcTimeString : utcTimeString + 'Z';
        const messageDate = new Date(timeString);

        // Check if the date is valid
        if (isNaN(messageDate.getTime())) {
            console.error('Invalid date string:', utcTimeString);
            return '';
        }

        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
        const messageDay = new Date(messageDate.getFullYear(), messageDate.getMonth(), messageDate.getDate());

        if (messageDay.getTime() === today.getTime()) {
            // Today: show time in hh:mm AM/PM format
            return messageDate.toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            });
        } else if (messageDay.getTime() === yesterday.getTime()) {
            // Yesterday
            return 'Yesterday';
        } else {
            // Older dates: show date in MM/DD/YYYY format
            return messageDate.toLocaleDateString([], {
                month: '2-digit',
                day: '2-digit',
                year: 'numeric'
            });
        }
    };

    // Add this function after formatChatTime
    const formatDateSeparator = (utcTimeString) => {
        if (!utcTimeString) return '';

        const timeString = utcTimeString.endsWith('Z') ? utcTimeString : utcTimeString + 'Z';
        const messageDate = new Date(timeString);

        if (isNaN(messageDate.getTime())) {
            return '';
        }

        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
        const messageDay = new Date(messageDate.getFullYear(), messageDate.getMonth(), messageDate.getDate());

        if (messageDay.getTime() === today.getTime()) {
            return 'Today';
        } else if (messageDay.getTime() === yesterday.getTime()) {
            return 'Yesterday';
        } else {
            // Format as "July 25, 2025"
            return messageDate.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        }
    };

    // Add this function to group messages by date
    const groupMessagesByDate = (messages) => {
        if (!messages || messages.length === 0) return [];

        const groups = [];
        let currentGroup = null;

        messages.forEach((message) => {
            const messageDate = message.fullDate;
            const dateSeparator = formatDateSeparator(messageDate);

            if (!currentGroup || currentGroup.date !== dateSeparator) {
                currentGroup = {
                    date: dateSeparator,
                    messages: [message]
                };
                groups.push(currentGroup);
            } else {
                currentGroup.messages.push(message);
            }
        });

        return groups;
    };

    const fetchChatList = async (showLoading) => {
        if (showLoading)
            setIsLoadingChatList(showLoading)
        setLoadingChatListError(null)

        try {
            const response = await chatService.getChatList();
            if (response.success && response.data) {
                const formattedChats = response.data.map(chat => ({
                    id: chat.roomId,
                    accountId: chat.isGroup ? null : chat.otherAccountId,
                    name: chat.isGroup ? chat.groupName : chat.otherUsername,
                    lastMessage: chat.lastMessage || '',
                    time: formatChatTime(chat.lastMessageTime),
                    unread: chat.unreadCount || 0,
                    isGroup: chat.isGroup,
                    photo: chat.isGroup ? chat.groupPhoto : chat.otherPhoto,
                    messages: []
                }));
                setChatList(formattedChats);
                // Update total unread count using ChatContext
                calculateTotalUnread(formattedChats);
            }
            else {
                setLoadingChatListError(response.message || 'Failed to fetch chat list');
                setChatList([]);
            }
        }
        catch (err) {
            console.error('Error fetching activities:', err);
            setLoadingChatListError('An unexpected error occurred while fetching chat');
            setChatList([]);
        } finally {
            setIsLoadingChatList(false);
        }
    };

    // Initial fetch of chat list
    useEffect(() => {
        fetchChatList(true);
    }, []);

    // Add this new useEffect to restore selected chat from localStorage after refresh
    useEffect(() => {
        // Only run this after chatList has been loaded and is not empty
        if (chatList.length > 0 && !isLoadingChatList) {
            const savedChatId = localStorage.getItem('selectedChatId');

            if (savedChatId) {
                const savedChat = chatList.find(chat => chat.id.toString() === savedChatId);

                // Only restore selection if the chat exists and has messages (not a temporary chat)
                // AND if it's not already selected (to prevent infinite loop)
                if (savedChat && savedChat.lastMessage && selectedChatId !== savedChat.id) {
                    // Update the selected chat with unread count reset to 0
                    const updatedChat = { ...savedChat, unread: 0 };
                    setSelectedChat(updatedChat);
                    setSelectedChatId(savedChat.id);
                    selectedChatIdRef.current = savedChat.id;

                    // Update the chat in the chats list and recalculate total unread
                    setChatList(prevChats => {
                        const updatedChats = prevChats.map(c => c.id === savedChat.id ? updatedChat : c);
                        // Update total unread count in ChatContext
                        calculateTotalUnread(updatedChats);
                        return updatedChats;
                    });

                    // Mark chat as read on the server
                    if (savedChat.unread > 0) {
                        chatService.markChatAsRead(savedChat.id)
                            .catch(error => console.error('Error marking chat as read:', error));
                    }

                    // Fetch messages for the restored chat
                    fetchChatMessageList(savedChat.id, 1, false);
                }
            }
        }
    }, [chatList, isLoadingChatList, selectedChatId, calculateTotalUnread]);

    const fetchChatMessageList = async (chatRoomId, page = 1, showLoading) => {
        if (!chatRoomId) return;

        if (showLoading)
            setIsLoadingMessageList(showLoading);

        setLoadingMessageListError(null);

        // Only auto-scroll to bottom for first page, not for pagination
        setShouldScrollToBottom(page === 1);

        // Store current scroll position and the first visible message for pagination
        let scrollInfo = null;
        if (page > 1 && messagesRef.current) {
            const container = messagesRef.current;
            const firstVisibleMessage = container.querySelector('.message-item');
            scrollInfo = {
                scrollTop: container.scrollTop,
                scrollHeight: container.scrollHeight,
                firstMessageId: firstVisibleMessage?.getAttribute('data-message-id')
            };
        }

        try {
            const response = await chatService.getChatMessageList(chatRoomId, page);
            const formattedMessages = response.data.map(msg => ({
                id: msg.messageId,
                text: msg.content,
                sent: msg.sentBy === user.accountId,
                time: new Date(msg.sentDate + 'Z').toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true
                }),
                fullDate: msg.sentDate, // Add full date for grouping
                isRead: msg.isRead
            }));

            setMessageList(prevMessages => {
                const currentMessages = prevMessages[chatRoomId] || [];

                if (page === 1) {
                    return {
                        ...prevMessages,
                        [chatRoomId]: formattedMessages
                    };
                } else {
                    return {
                        ...prevMessages,
                        [chatRoomId]: [...formattedMessages, ...currentMessages]
                    };
                }
            });

            setCurrentMessagePage(page);

            // Restore scroll position immediately after state update for pagination
            if (page > 1 && scrollInfo && messagesRef.current) {
                // Use requestAnimationFrame to ensure DOM is updated
                requestAnimationFrame(() => {
                    const container = messagesRef.current;
                    if (container) {
                        const newScrollHeight = container.scrollHeight;
                        const heightDifference = newScrollHeight - scrollInfo.scrollHeight;
                        container.scrollTop = scrollInfo.scrollTop + heightDifference;
                    }
                });
            }
        }
        catch (err) {
            console.error('Error fetching messages:', err);
            setLoadingMessageListError('An unexpected error occurred while fetching messages');
            setMessageList([]);
        }
        finally {
            setIsLoadingMessageList(false);
        }
    }

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!message.trim() || !selectedChat) return;

        // Clear any previous errors
        setSendMessageError(null);

        try {
            const response = await chatService.sendMessage(
                selectedChat.accountId,
                message.trim()
            );

            if (response.success) {
                // Check if this is a temporary chat (created with Date.now())
                const isTemporaryChat = selectedChat.id > 1000000000000;

                if (isTemporaryChat) {
                    // For temporary chats, refresh the chat list to get the real server ID
                    // Store the account ID to maintain selection
                    const selectedAccountId = selectedChat.accountId;

                    // Refresh chat list
                    await fetchChatList(false);

                    // Find the chat with the same account ID after refresh
                    setTimeout(() => {
                        setChatList(prevChats => {
                            const realChat = prevChats.find(chat =>
                                !chat.isGroup && chat.accountId === selectedAccountId
                            );

                            if (realChat) {
                                // Update selection to the real chat
                                setSelectedChat(realChat);
                                setSelectedChatId(realChat.id);
                                selectedChatIdRef.current = realChat.id;

                                // Update localStorage with real IDs
                                localStorage.setItem('selectedChatId', realChat.id.toString());
                                localStorage.setItem('selectedAccountId', selectedAccountId.toString());

                                // Fetch messages for the real chat
                                fetchChatMessageList(realChat.id, 1, false);
                            }

                            return prevChats;
                        });
                    }, 100);

                    setMessage('');
                    setShouldScrollToBottom(true);
                    return;
                }

                // For existing chats, keep the current optimistic update logic
                const newMessage = {
                    id: `temp_${Date.now()}_${Math.random()}`,
                    text: message,
                    sent: true,
                    time: new Date().toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true
                    })
                };

                // Create the updated chat object
                const updatedChat = {
                    ...selectedChat,
                    messages: [...selectedChat.messages, newMessage],
                    lastMessage: message,
                    time: newMessage.time
                };

                // Update the chats array
                setChatList(prevChats => {
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
                    const currentChat = chatList.find(chat => chat.id === updatedChat.id);
                    if (currentChat) {
                        setSelectedChat(currentChat);
                        // Add this line to update the selectedChatId
                        setSelectedChatId(currentChat.id);
                    }
                }, 50);
                setMessageList(prevMessages => ({
                    ...prevMessages,
                    [selectedChat.id]: [...(prevMessages[selectedChat.id] || []), newMessage]
                }));

                // No need for the setTimeout anymore
                setMessage('');
                setShouldScrollToBottom(true); // Ensure we scroll to the bottom
            } else {
                setSendMessageError(response.message || 'Failed to send message. Please try again.');
            }
        } catch (error) {
            console.error('Error sending message:', error);
            // You could show an error notification here
        }
    };

    // Auto-hide error after 5 seconds
    useEffect(() => {
        if (sendMessageError) {
            const timer = setTimeout(() => {
                setSendMessageError(null);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [sendMessageError]);

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
                    setMessageList(prevMessages => {
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
                setChatList(prevChats => {
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
                    if (isSelectedChat && normalizedData.sentBy !== user.accountId) {
                        // Only mark as read if this chat has a real server ID (not a temporary one)
                        const selectedChat = prevChats.find(chat => chat.id === normalizedData.roomId);
                        const isTemporaryChat = !selectedChat.lastMessage && selectedChat.id > 1000000000000;

                        if (!isTemporaryChat) {
                            chatService.markChatAsRead(normalizedData.roomId)
                                .catch(error => console.error('Error marking chat as read:', error));
                        }
                    }

                    // Update the chat with new message info
                    const updatedChats = prevChats.map(chat => {
                        if (chat.id === normalizedData.roomId) {
                            // Check if this is the selected chat AND not a temporary chat
                            const isRealSelectedChat = isSelectedChat && chat.lastMessage;

                            // Don't increment unread count for messages sent by the current user
                            if (normalizedData.sentBy === user.accountId) {
                                return {
                                    ...chat,
                                    lastMessage: normalizedData.message,
                                    time: formatChatTime(normalizedData.sentAt),
                                    unread: chat.unread || 0
                                };
                            }

                            return {
                                ...chat,
                                lastMessage: normalizedData.message,
                                time: formatChatTime(normalizedData.sentAt),
                                // Only set unread to 0 if it's the selected chat, otherwise increment
                                unread: isRealSelectedChat ? 0 : (chat.unread || 0) + 1
                            };
                        }
                        return chat;
                    });

                    // Sort the chats to bring the most recently messaged chat to the top
                    const sortedChats = updatedChats.sort((a, b) => {
                        // The chat that just received/sent a message should be at the top
                        if (a.id === normalizedData.roomId) return -1;
                        if (b.id === normalizedData.roomId) return 1;

                        // For other chats, maintain their relative order
                        return 0;
                    });

                    // Update total unread count in ChatContext
                    calculateTotalUnread(sortedChats);

                    return sortedChats;
                });
            }
            catch (err) {
                console.error('Error processing new message:', err);
            }
        })

        // Clean up SignalR connections when component unmounts
        return () => {
            unsubscribeSentMessage();
        };
    }, [user.accountId, calculateTotalUnread]);

    // Function to handle new chat button click
    const handleNewChat = () => {
        setShowAccountList(true);
        setAccountPage(1); // Reset to first page when opening
    };

    const handleBackToList = () => {
        setShowMobileChat(false);
    };

    const handleAccountSelect = (account) => {
        const existingChat = chatList.find(chat => !chat.isGroup && chat.accountId === account.accountId);

        if (existingChat) {
            setSelectedChat(existingChat);
            selectedChatIdRef.current = existingChat.id;
            setSelectedChatId(existingChat.id);
            localStorage.setItem('selectedAccountId', account.accountId.toString());
            localStorage.setItem('selectedChatId', existingChat.id.toString());

            // Fetch messages for the existing chat
            fetchChatMessageList(existingChat.id, 1, true);
        } else {
            // Create a new chat with this account
            const newChat = {
                id: Date.now(),
                accountId: account.accountId,
                name: account.employeeName,
                lastMessage: '',
                time: formatChatTime(new Date().toISOString()),
                unread: 0,
                isGroup: false,
                photo: account.photo || '',
                messages: [],
                isTemporary: true
            };

            // Add to chats array
            setChatList(prevChats => [newChat, ...prevChats]);
            setSelectedChat(newChat);
            selectedChatIdRef.current = newChat.id;
            setSelectedChatId(newChat.id);
            localStorage.setItem('selectedAccountId', account.accountId.toString());
            localStorage.setItem('selectedChatId', newChat.id.toString());

            // Initialize empty message list for new chat
            setMessageList([]);
            setShowMobileChat(true);
        }

        setShowAccountList(false);
    };

    const handleChatSelect = (chat) => {
        // Update the selected chat with unread count reset to 0
        const updatedChat = { ...chat, unread: 0 };
        setSelectedChat(updatedChat);
        setSelectedChatId(updatedChat.id);
        selectedChatIdRef.current = updatedChat.id;
        setShowMobileChat(true);

        // Save selected chat ID to localStorage
        localStorage.setItem('selectedChatId', chat.id.toString());

        // Also save the account ID if this is a direct chat
        if (!chat.isGroup && chat.accountId) {
            localStorage.setItem('selectedAccountId', chat.accountId.toString());
        }

        // Update the chat in the chats list and recalculate total unread
        setChatList(prevChats => {
            const updatedChats = prevChats.map(c => c.id === chat.id ? updatedChat : c);
            // Update total unread count in ChatContext
            calculateTotalUnread(updatedChats);
            return updatedChats;
        });

        // Mark chat as read on the server
        if (chat.unread > 0) {
            chatService.markChatAsRead(chat.id)
                .catch(error => console.error('Error marking chat as read:', error));
        }

        // Only fetch messages if this is not a newly created chat without a server ID
        // Check if the ID is a temporary one (created with Date.now())
        const isTemporaryChat = !chat.lastMessage && chat.id > 1000000000000;

        if (!isTemporaryChat) {
            // Fetch messages for the selected chat
            fetchChatMessageList(chat.id, 1, true);
        } else {
            // For new chats without messages, just set an empty messages array
            setMessageList(prevMessages => ({
                ...prevMessages,
                [chat.id]: []
            }));
            setLoadingMessageListError(null);
        }
    };

    return (
        <div className={`fixed inset-0 flex flex-col ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
            <div className={`${isSidebarOpen ? 'backdrop-blur-sm' : ''} transition-all duration-300`}>
                <Navbar onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />
            </div>

            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

            {/* Error notification */}
            {sendMessageError && (
                <div className="fixed top-5 sm:right-5 z-50 sm:max-w-sm w-full">
                    <div className={`bg-red-500 rounded-lg p-4 shadow-lg`}>
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <svg className={`h-5 w-5 text-white`} viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3 flex-1">
                                <p className={`text-sm font-medium text-white`}>
                                    {sendMessageError}
                                </p>
                            </div>
                            <div className="ml-auto pl-3">
                                <button
                                    onClick={() => setSendMessageError(null)}
                                    className={`inline-flex rounded-md p-1.5 text-white hover:bg-red-400 focus:outline-none focus:ring-2 focus:ring-red-500`}
                                >
                                    <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

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

            <div className={`flex-1 flex lg:pl-64 mt-16 overflow-y-auto ${darkMode ? 'custom-scrollbar-dark' : 'custom-scrollbar-light'}`}>
                <ChatList
                    showMobileChat={showMobileChat}
                    fetchChatList={fetchChatList}
                    chatList={chatList}
                    isLoadingChatList={isLoadingChatList}
                    loadingChatListError={loadingChatListError}
                    handleNewChat={handleNewChat}
                    handleAccountSelect={handleAccountSelect}
                    selectedChatId={selectedChatId}
                    handleChatSelect={handleChatSelect} />

                {/* In the return statement where ChatBox is rendered */}
                <ChatBox
                    showMobileChat={showMobileChat}
                    selectedChat={selectedChat}
                    handleNewChat={handleNewChat}
                    handleBackToList={handleBackToList}
                    fetchChatMessageList={fetchChatMessageList}
                    messageList={messageList}
                    messagesRef={messagesRef}
                    shouldScrollToBottom={shouldScrollToBottom}
                    isLoadingMessageList={isLoadingMessageList}
                    loadingMessageListError={loadingMessageListError}
                    currentMessagePage={currentMessagePage}
                    handleSendMessage={handleSendMessage}
                    message={message}
                    setMessage={setMessage}
                    groupMessagesByDate={groupMessagesByDate}
                />
            </div>
        </div>
    )
}

export default Chat;
