import { apiService } from './apiService';

const chatService = {
    // Get account list for chat with pagination
    getAccountListForChat: async (page = 1) => {
        return apiService.get('/Chat/getAccountListForChat', { page });
    },

    // Get chat list for the current user
    getChatList: async () => {
        return apiService.get('/Chat/getChatList');
    },

    // Send a message to a chat
    sendMessage: async (receiverAccountId, content) => {
        return apiService.post('/Chat/sendMessage', {
            receiverAccountId,
            content
        });
    },
    
    // Get chat message list by chatRoomId with pagination
    getChatMessageList: async (chatRoomId, page = 1) => {
        return apiService.post('/Chat/getChatMessageList', {
            chatRoomId,
            page
        });
    },
    
    // Mark all messages in a chat as read
    markChatAsRead: async (chatRoomId) => {
        return apiService.post('/Chat/markChatAsRead', {
            chatRoomId
        });
    }
};

export default chatService;