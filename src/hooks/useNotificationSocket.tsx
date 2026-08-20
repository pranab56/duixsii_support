import { useEffect } from 'react';
import io from 'socket.io-client';
import { notification } from 'antd';
import { useAppDispatch } from '../redux/hooks';
import { notificationApi } from '../features/notification/notificationApi';
import { useGetMyProfileQuery } from '../features/profile/profileApi';
import { baseURL } from '../utils/BaseURL';
import { getFromLocalStorage } from '../utils/localStorage';

export const useNotificationSocket = () => {
    const dispatch = useAppDispatch();
    const { data: profileResponse } = useGetMyProfileQuery();

    const profile = profileResponse?.data?.result || (profileResponse?.data as any);
    const storedUserDataStr = getFromLocalStorage('userData');
    let storedUserData: any = {};
    if (storedUserDataStr) {
        try {
            storedUserData = JSON.parse(storedUserDataStr);
        } catch {
            storedUserData = {};
        }
    }

    // Resolve userId accurately from profile response or stored userData
    const userId = profile?._id || profile?.id || storedUserData?._id || storedUserData?.id || storedUserData?.user?._id || storedUserData?.user?.id;

    // Retrieve token from storage utility and localStorage keys
    const rawToken = (typeof window !== 'undefined'
        ? (getFromLocalStorage('accessToken') || getFromLocalStorage('douxsii-admin-token') || getFromLocalStorage('token'))
        : null) || '';

    const cleanToken = rawToken ? rawToken.replace(/^Bearer\s+/i, '') : '';
    const bearerToken = cleanToken ? `Bearer ${cleanToken}` : '';

    useEffect(() => {
        if (!userId) {
            console.log('[Socket.io] Waiting for userId before establishing socket connection...');
            return;
        }

        const socketURL = baseURL.replace(/\/$/, '');
        const userEventName = `notification::${userId}`;

        console.log(`[Socket.io] Connecting to ${socketURL} for user ${userId} on event [${userEventName}]`);

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

        const handleIncomingNotification = (data: any) => {
            console.log(`[Socket.io] Realtime notification received on event [${userEventName}]:`, data);

            const title = data?.title || data?.data?.title || 'New Notification';
            const message = data?.message || data?.data?.message || 'You have received a new notification.';

            notification.open({
                message: <span className="font-bold text-[#56000c] text-sm">{title}</span>,
                description: <span className="text-gray-600 text-xs">{message}</span>,
                icon: <span className="text-xl">🔔</span>,
                duration: 5,
                style: {
                    borderRadius: '12px',
                    border: '1px solid #FFD2D6',
                    backgroundColor: '#FFF5F6',
                }
            });

            // Invalidate tags & force RTK query network refetch
            dispatch(notificationApi.util.invalidateTags(['notification']));
            dispatch(notificationApi.endpoints.getAllNotification.initiate(undefined, { subscribe: false, forceRefetch: true }));
        };

        socket.on('connect', () => {
            console.log(`[Socket.io] Connected successfully! Socket ID: ${socket.id}. Event: ${userEventName}`);
        });

        socket.on(userEventName, handleIncomingNotification);
        socket.on('notification', handleIncomingNotification);
        socket.on('getNotification', handleIncomingNotification);

        socket.on('connect_error', (err: any) => {
            console.error('[Socket.io] Connection error:', err);
        });

        return () => {
            socket.off(userEventName, handleIncomingNotification);
            socket.off('notification', handleIncomingNotification);
            socket.off('getNotification', handleIncomingNotification);
            socket.disconnect();
        };
    }, [userId, cleanToken, bearerToken, dispatch]);
};
