import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import AccountList from '../components/Chat/AccountList';
import ChatList from '../components/Chat/ChatList';
import ChatBox from '../components/Chat/ChatBox';
import { useTheme } from '../context/ThemeContext';
import chatService from '../services/chatService';

function Chat (){
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

    const fetchChatList = async (showLoading) => {
        if(showLoading)
            setIsLoadingChatList(showLoading)
        setLoadingChatListError(null)

        try{
            const response = await chatService.getChatList();
            if(response.success && response.data){

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
                setChatList(formattedChats);
            }
            else{
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
    }

    useEffect(() => {
        fetchChatList(true)
    }, [])

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
            setChatList(prevChats => [...prevChats, newChat]);
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

    return(
        <div className={`fixed inset-0 flex flex-col ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
            <div className={`${isSidebarOpen ? 'backdrop-blur-sm' : ''} transition-all duration-300`}>
                <Navbar onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />
            </div>

            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

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
                    selectedChatId={selectedChatId} />

                <ChatBox
                    showMobileChat={showMobileChat}
                    selectedChat={selectedChat}
                    handleNewChat={handleNewChat}
                    handleBackToList={handleBackToList} />
            </div>
        </div>
    )
}

export default Chat;