import { useEffect } from 'react';
import io from 'socket.io-client';
import { useAppDispatch } from '../redux/hooks';
import { chatsApi } from '../features/agent/chats/chatsApi';
import { messagesApi } from '../features/agent/messages/messagesApi';
import { baseURL } from '../utils/BaseURL';
import { getFromLocalStorage } from '../utils/localStorage';

export const useChatSocket = (chatId?: string | null) => {
    const dispatch = useAppDispatch();

    const storedUserDataStr = getFromLocalStorage('userData');
    let storedUserData: any = {};
    if (storedUserDataStr) {
        try {
            storedUserData = JSON.parse(storedUserDataStr);
        } catch {
            storedUserData = {};
        }
    }
    const userId = storedUserData?._id || storedUserData?.id || storedUserData?.user?._id || storedUserData?.user?.id;

    const rawToken = (typeof window !== 'undefined'
        ? (getFromLocalStorage('accessToken') || getFromLocalStorage('douxsii-support-token') || getFromLocalStorage('token'))
        : null) || '';

    const cleanToken = rawToken ? rawToken.replace(/^Bearer\s+/i, '') : '';
    const bearerToken = cleanToken ? `Bearer ${cleanToken}` : '';

    useEffect(() => {
        const socketURL = baseURL.replace(/\/$/, '');
        const socketOptions: any = {
            transports: ['websocket', 'polling'],
            auth: {
                token: cleanToken,
                accessToken: cleanToken,
                authorization: bearerToken || cleanToken,
                Authorization: bearerToken || cleanToken,
            },
            query: {
                token: cleanToken,
                authorization: bearerToken || cleanToken,
            },
            extraHeaders: cleanToken ? {
                authorization: bearerToken,
                Authorization: bearerToken,
                token: cleanToken,
            } : {},
            autoConnect: true,
        };

        const socket: any = io(socketURL, socketOptions);

        const handleIncomingMessage = (data: any) => {
            console.log('[Socket.io Global Chat] Realtime event received:', data);

            const incomingChatId = data?.chatId || data?.message?.chatId || data?.data?.chatId;
            if (incomingChatId && typeof window !== 'undefined') {
                window.dispatchEvent(new CustomEvent('new_chat_message', { detail: { chatId: incomingChatId } }));
            }

            // Instantly invalidate tags so RTK Query updates chat list & current messages in real time
            dispatch(chatsApi.util.invalidateTags(['chat']));
            dispatch(messagesApi.util.invalidateTags(['messages']));

            // Force network refetch for chat list
            dispatch(chatsApi.endpoints.getChats.initiate(undefined, { subscribe: false, forceRefetch: true }));

            // If a specific chat is selected, force refetch its messages
            if (chatId) {
                dispatch(messagesApi.endpoints.getMessages.initiate(chatId, { subscribe: false, forceRefetch: true }));
            }
        };

        socket.on('connect', () => {
            console.log(`[Socket.io Global Chat] Connected successfully! Socket ID: ${socket.id}`);
        });

        // Register event listeners for chatId and userId
        if (chatId) {
            socket.on(`new-message::${chatId}`, handleIncomingMessage);
        }
        if (userId) {
            socket.on(`chat-list::${userId}`, handleIncomingMessage);
            socket.on(`new-message::${userId}`, handleIncomingMessage);
            socket.on(`message::${userId}`, handleIncomingMessage);
        }
        socket.on('chat-list', handleIncomingMessage);
        socket.on('new-message', handleIncomingMessage);
        socket.on('message', handleIncomingMessage);

        socket.on('connect_error', (err: any) => {
            console.error('[Socket.io Global Chat] Connection error:', err);
        });

        return () => {
            if (chatId) {
                socket.off(`new-message::${chatId}`, handleIncomingMessage);
            }
            if (userId) {
                socket.off(`chat-list::${userId}`, handleIncomingMessage);
                socket.off(`new-message::${userId}`, handleIncomingMessage);
                socket.off(`message::${userId}`, handleIncomingMessage);
            }
            socket.off('chat-list', handleIncomingMessage);
            socket.off('new-message', handleIncomingMessage);
            socket.off('message', handleIncomingMessage);
            socket.disconnect();
        };
    }, [chatId, userId, cleanToken, bearerToken, dispatch]);
};

export default useChatSocket;
