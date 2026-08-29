import { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import PageHeader from '../../components/ui/PageHeader';
import Toast from '../../components/ui/Toast';
import { SupportChat, ChatMessage } from './chats.types';
import ChatSidebar from './ChatSidebar';
import ChatWindow from './ChatWindow';
import { useGetChatsQuery, useSeenChatsQuery, ChatListItem } from '../../features/agent/chats/chatsApi';
import { useGetMessagesQuery, useCreateMessageMutation, useMarkAsSolvedMutation, ApiMessageItem } from '../../features/agent/messages/messagesApi';
import { getFromLocalStorage } from '../../utils/localStorage';
import { useChatSocket } from '../../hooks/useChatSocket';

const STATUS_BADGE: Record<string, string> = {
    'Open': 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
    'In Progress': 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20',
    'Resolved': 'bg-green-500/10 text-green-400 border border-green-500/20',
    'Closed': 'bg-white/10 text-white/50 border border-white/10',
};

// Generates avatar background color based on name length or character code
const getAvatarBg = (name: string) => {
    const colors = [
        'bg-[#560e18]', 'bg-[#1e3a8a]', 'bg-[#115e59]',
        'bg-[#7c2d12]', 'bg-[#581c87]', 'bg-[#0369a1]'
    ];
    let sum = 0;
    for (let i = 0; i < (name || '').length; i++) {
        sum += name.charCodeAt(i);
    }
    return colors[sum % colors.length];
};

const Chats = () => {
    const location = useLocation();
    const [selectedChatKey, setSelectedChatKey] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState<'active' | 'resolved'>('active');
    const [toast, setToast] = useState('');

    // Connect real-time socket.io for selected chat messages
    useChatSocket(selectedChatKey);

    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Get current logged in user ID from localStorage
    const localUserStr = getFromLocalStorage('userData');
    let currentUserId = '';
    if (localUserStr) {
        try {
            currentUserId = JSON.parse(localUserStr)?._id || '';
        } catch {
            currentUserId = '';
        }
    }

    // State to track chats read/seen during current session
    const [readChatKeys, setReadChatKeys] = useState<Record<string, boolean>>({});

    // RTK Query hooks
    const { data: chatsRes, isLoading: isLoadingChats, refetch: refetchChats } = useGetChatsQuery();
    const { data: messagesRes, isLoading: isLoadingMessages } = useGetMessagesQuery(selectedChatKey || '', {
        skip: !selectedChatKey,
    });
    const [createMessage] = useCreateMessageMutation();
    const [markAsSolved, { isLoading: isMarkingSolved }] = useMarkAsSolvedMutation();

    // Hit seenChats query when a chat is selected/clicked to mark as seen on backend
    useSeenChatsQuery(selectedChatKey || '', {
        skip: !selectedChatKey,
    });

    // Mark current selected chat as read locally and refetch chat list from backend
    useEffect(() => {
        if (selectedChatKey) {
            setReadChatKeys(prev => ({ ...prev, [selectedChatKey]: true }));
            refetchChats();
        }
    }, [selectedChatKey, messagesRes, refetchChats]);

    // Handle new incoming message events to reset read state for unselected incoming chats
    useEffect(() => {
        const handleNewMessageEvent = (e: any) => {
            const incomingId = e.detail?.chatId;
            if (incomingId && incomingId !== selectedChatKey) {
                setReadChatKeys(prev => {
                    const next = { ...prev };
                    delete next[incomingId];
                    return next;
                });
            }
        };

        window.addEventListener('new_chat_message', handleNewMessageEvent);
        return () => {
            window.removeEventListener('new_chat_message', handleNewMessageEvent);
        };
    }, [selectedChatKey]);

    const showToast = (msg: string) => {
        setToast(msg);
        setTimeout(() => setToast(''), 3000);
    };

    // Combine pinned and unpinned chat lists from API
    const pinned = chatsRes?.data?.pinned || [];
    const unpinned = chatsRes?.data?.unpinned || [];
    const rawChats: ChatListItem[] = [...pinned, ...unpinned];

    // Normalize raw API chat items to SupportChat model
    const chats: SupportChat[] = rawChats.map((item) => {
        const chat = item.chat;
        const participants = chat?.participants || [];
        const customer = participants.find((p: any) => p?.role !== 'support_agent' && p?.role !== 'Support Agent') || participants[0] || {};
        const customerName = customer?.fullName || customer?.name || 'Customer';
        const customerEmail = customer?.email || '';
        const receiverId = customer?._id || '';

        const lastMsgText = item.message?.text || item.message?.message || 'No messages yet';
        const timeStr = chat?.updatedAt
            ? new Date(chat.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            : '';

        const isSolved = Boolean(chat?.isSolved);

        let status: SupportChat['status'] = 'Open';
        if (isSolved) {
            status = 'Resolved';
        } else if (chat?.status === 'accepted') {
            status = 'In Progress';
        } else {
            status = 'Open';
        }

        const isReadInSession = Boolean(readChatKeys[chat._id]);

        // Determine unread count strictly based on item.message.seen
        let calculatedUnreadCount = 0;
        if (isReadInSession) {
            calculatedUnreadCount = 0;
        } else if (item.message && typeof item.message.seen === 'boolean') {
            calculatedUnreadCount = item.message.seen ? 0 : (item.unreadMessageCount || 1);
        } else {
            calculatedUnreadCount = item.unreadMessageCount || 0;
        }

        return {
            key: chat._id,
            chatId: chat._id,
            userName: customerName,
            userEmail: customerEmail,
            receiverId,
            userAvatar: customer?.profile,
            subject: `Ticket #${chat._id.slice(-6)}`,
            lastMessage: lastMsgText,
            lastMessageTime: timeStr,
            status,
            isSolved,
            messages: [],
            unreadCount: calculatedUnreadCount,
        };
    });

    // Handle initial selection from route state or default chat
    useEffect(() => {
        if (chats.length === 0) return;
        const stateObj = (location.state as any) || {};
        const stateChatId = stateObj.chatId;
        const stateUserId = stateObj.userId;
        const stateUserName = stateObj.userName;

        if (stateChatId || stateUserId || stateUserName) {
            const targetChat = chats.find(c =>
                (stateChatId && (c.chatId === stateChatId || c.key === stateChatId)) ||
                (stateUserId && (c.receiverId === stateUserId || c.chatId === stateUserId || c.key === stateUserId)) ||
                (stateUserName && c.userName.toLowerCase() === stateUserName.toLowerCase())
            );

            if (targetChat) {
                setSelectedChatKey(targetChat.key);
                const isTargetSolved = Boolean(targetChat.isSolved);
                setActiveTab(isTargetSolved ? 'resolved' : 'active');
                return;
            }
        }

        if (!selectedChatKey) {
            const initialActiveChats = chats.filter(c => !c.isSolved);
            if (initialActiveChats.length > 0) {
                setSelectedChatKey(initialActiveChats[0].key);
                setActiveTab('active');
            } else {
                setSelectedChatKey(chats[0].key);
                setActiveTab(chats[0].isSolved ? 'resolved' : 'active');
            }
        }
    }, [chats, location.state]);

    // Handle manual tab change selection
    useEffect(() => {
        if (chats.length === 0) return;
        const tabChats = chats.filter(chat => {
            if (activeTab === 'active') return !chat.isSolved;
            return Boolean(chat.isSolved);
        });

        if (tabChats.length > 0 && (!selectedChatKey || !tabChats.some(c => c.key === selectedChatKey))) {
            setSelectedChatKey(tabChats[0].key);
        }
    }, [activeTab]);

    // Format fetched messages for selected chat
    let rawMessages: ApiMessageItem[] = [];
    if (Array.isArray(messagesRes?.data)) {
        rawMessages = messagesRes.data;
    } else if (messagesRes?.data?.newResult) {
        const pinnedMsgs = messagesRes.data.newResult.pinned || [];
        const resultMsgs = messagesRes.data.newResult.result || [];
        rawMessages = [...pinnedMsgs, ...resultMsgs];
    } else if (messagesRes?.data?.messages) {
        rawMessages = messagesRes.data.messages;
    }

    // Sort messages chronologically (oldest first at top, newest at bottom)
    const sortedMessages = [...rawMessages].sort((a: any, b: any) => {
        const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return timeA - timeB;
    });

    const formattedMessages: ChatMessage[] = sortedMessages.map((msg: any) => {
        const senderId = typeof msg.sender === 'object' ? msg.sender?._id : msg.sender;
        const senderRole = typeof msg.sender === 'object' ? msg.sender?.role : '';
        const isAgentSender = senderId === currentUserId || senderRole === 'support_agent' || senderRole === 'Support Agent';

        return {
            id: msg._id || Date.now().toString(),
            sender: isAgentSender ? 'agent' : 'user',
            text: msg.message || msg.text || '',
            image: msg.image || null,
            time: msg.createdAt
                ? new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                : '',
        };
    });

    const activeChat = chats.find(c => c.key === selectedChatKey);
    const selectedChat: SupportChat | undefined = activeChat
        ? { ...activeChat, messages: formattedMessages }
        : undefined;

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [formattedMessages.length, selectedChatKey]);

    const handleSendMessage = async (text: string, imageFile?: File | null) => {
        if (!selectedChatKey || !selectedChat) return;

        try {
            const formData = new FormData();
            formData.append('chatId', selectedChat.chatId);
            formData.append('message', text);
            if (selectedChat.receiverId) {
                formData.append('receiver', selectedChat.receiverId);
            }
            if (imageFile) {
                formData.append('image', imageFile);
            }

            const response = await createMessage(formData).unwrap();
            console.log(response)
            showToast('');
        } catch (err: any) {
            console.error('Send Message Error:', err);
            const errorMsg = err?.data?.message || err?.message || 'Failed to send message';
            showToast(errorMsg);
        }
    };

    const handleStatusChange = async (_status: SupportChat['status']) => {
        if (!selectedChatKey || !selectedChat) return;

        try {
            const res = await markAsSolved(selectedChat.chatId).unwrap();
            showToast(res?.message || 'Chat Solved successfully');
        } catch (err: any) {
            console.error("Mark As Solved Error:", err);
            const errorMsg = err?.data?.message || err?.message || 'Failed to mark chat as solved';
            showToast(errorMsg);
        }
    };

    // Filter chats based on tab and search query
    const filteredChats = chats.filter(chat => {
        const matchesTab = activeTab === 'active'
            ? !chat.isSolved
            : Boolean(chat.isSolved);

        const matchesSearch =
            chat.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            chat.chatId.toLowerCase().includes(searchQuery.toLowerCase()) ||
            chat.subject.toLowerCase().includes(searchQuery.toLowerCase());

        return matchesTab && matchesSearch;
    });

    const activeChatsCount = chats.filter(c => !c.isSolved).length;
    const solvedChatsCount = chats.filter(c => Boolean(c.isSolved)).length;

    return (
        <div className="flex flex-col h-[calc(100vh-130px)]">
            <PageHeader
                title="Live Chats"
                subtitle="Real time performance monitoring and support health."
            />

            {/* Main Layout Container */}
            <div className="flex flex-col lg:flex-row gap-6 mt-2 flex-1 overflow-hidden min-h-0">
                <ChatSidebar
                    filteredChats={filteredChats}
                    selectedChatKey={selectedChatKey}
                    onSelectChat={setSelectedChatKey}
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                    activeTab={activeTab}
                    onTabChange={setActiveTab}
                    getAvatarBg={getAvatarBg}
                    statusBadge={STATUS_BADGE}
                    activeChatsCount={activeChatsCount}
                    solvedChatsCount={solvedChatsCount}
                    isLoading={isLoadingChats}
                />

                <ChatWindow
                    selectedChat={selectedChat}
                    onStatusChange={handleStatusChange}
                    onSendMessage={handleSendMessage}
                    showToast={showToast}
                    messagesEndRef={messagesEndRef}
                    getAvatarBg={getAvatarBg}
                    isLoadingMessages={isLoadingMessages}
                    isMarkingSolved={isMarkingSolved}
                />
            </div>

            {toast && <Toast message={toast} />}
        </div>
    );
};

export default Chats;
