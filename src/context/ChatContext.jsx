import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import chatService from '../services/chatService';
import signalRService from '../services/signalRService';

const ChatContext = createContext(null);

export const ChatProvider = ({ children }) => {
    const [totalUnreadCount, setTotalUnreadCount] = useState(0);
    const { user } = useAuth();

    // Function to calculate total unread count
    const calculateTotalUnread = (chatList) => {
        const total = chatList.reduce((sum, chat) => sum + (chat.unread || 0), 0);
        setTotalUnreadCount(total);
        return total;
    };

    // Function to fetch and update unread count
    const updateUnreadCount = async () => {
        if (!user) return;
        
        try {
            const response = await chatService.getChatList();
            if (response.success && response.data) {
                const total = response.data.reduce((sum, chat) => sum + (chat.unreadCount || 0), 0);
                setTotalUnreadCount(total);
            }
        } catch (error) {
            console.error('Error fetching chat list for unread count:', error);
        }
    };

    // Listen for SignalR message events to update unread count
    useEffect(() => {
        if (!user) return;

        const unsubscribeNewMessage = signalRService.on('NewMessage', (newMessage) => {
            // Only increment if message is not from current user
            if (newMessage.sentBy !== user.accountId) {
                setTotalUnreadCount(prev => prev + 1);
            }
        });

        return () => {
            unsubscribeNewMessage();
        };
    }, [user]);

    // Initial load of unread count
    useEffect(() => {
        if (user) {
            updateUnreadCount();
        }
    }, [user]);

    return (
        <ChatContext.Provider value={{ 
            totalUnreadCount, 
            setTotalUnreadCount, 
            calculateTotalUnread,
            updateUnreadCount 
        }}>
            {children}
        </ChatContext.Provider>
    );
};

export const useChat = () => {
    const context = useContext(ChatContext);
    if (!context) {
        throw new Error('useChat must be used within a ChatProvider');
    }
    return context;
};

export default ChatContext;