import { SupportChat } from './chats.types';

export const MOCK_CHATS: SupportChat[] = [
    {
        key: '1',
        chatId: 'TKT-1011',
        userName: 'Elena Gilbert',
        userEmail: 'elena@gmail.com',
        subject: 'My flower delivery seems to be stuck in...',
        lastMessage: 'Hello! I\'m reaching out because my order #8829-X for the "Midnight Velvet Roses" shows as "Delivered" in the app, but I haven\'t received anything at my door.',
        lastMessageTime: '2m ago',
        status: 'In Progress',
        unreadCount: 0,
        messages: [
            { 
                id: '1', 
                sender: 'user', 
                text: 'Hello! I\'m reaching out because my order #8829-X for the "Midnight Velvet Roses" shows as "Delivered" in the app, but I haven\'t received anything at my door.', 
                time: '10:44 AM' 
            },
            { 
                id: '2', 
                sender: 'agent', 
                text: 'Hi Elena! I\'m sorry to hear that. Let me check the real-time courier GPS data for you right away. One moment please.', 
                time: '10:45 AM' 
            }
        ]
    },
    {
        key: '2',
        chatId: 'TKT-1012',
        userName: 'Stefan Salvatore',
        userEmail: 'stefan@gmail.com',
        subject: 'Can I update the delivery address for order #4421?',
        lastMessage: 'Can I update the delivery address for order #4421?',
        lastMessageTime: '15m ago',
        status: 'In Progress',
        unreadCount: 0,
        messages: [
            { 
                id: '1', 
                sender: 'user', 
                text: 'Can I update the delivery address for order #4421?', 
                time: '10:30 AM' 
            }
        ]
    },
    {
        key: '3',
        chatId: 'TKT-1013',
        userName: 'Bonnie Bennett',
        userEmail: 'bonnie@gmail.com',
        subject: 'I received the wrong bouquet size.',
        lastMessage: 'I received the wrong bouquet size.',
        lastMessageTime: '1h ago',
        status: 'In Progress',
        unreadCount: 0,
        messages: [
            { 
                id: '1', 
                sender: 'user', 
                text: 'I received the wrong bouquet size.', 
                time: '09:45 AM' 
            }
        ]
    },
    {
        key: '4',
        chatId: 'TKT-1014',
        userName: 'Caroline Forbes',
        userEmail: 'caroline@gmail.com',
        subject: 'Thanks for the quick help!',
        lastMessage: 'Thanks for the quick help!',
        lastMessageTime: '2h ago',
        status: 'In Progress',
        unreadCount: 0,
        messages: [
            { 
                id: '1', 
                sender: 'user', 
                text: 'Thanks for the quick help!', 
                time: '08:45 AM' 
            },
            { 
                id: '2', 
                sender: 'agent', 
                text: 'You are most welcome.', 
                time: '08:47 AM' 
            }
        ]
    },
    {
        key: '5',
        chatId: 'TKT-1015',
        userName: 'Elena Gilbert',
        userEmail: 'elena@gmail.com',
        subject: 'My flower delivery seems to be stuck in...',
        lastMessage: 'Hello! I\'m reaching out because my order #8829-X for the "Midnight Velvet Roses" shows as "Delivered" in the app, but I haven\'t received anything at my door.',
        lastMessageTime: '2m ago',
        status: 'Open',
        unreadCount: 0,
        messages: [
            { 
                id: '1', 
                sender: 'user', 
                text: 'Hello! I\'m reaching out because my order #8829-X for the "Midnight Velvet Roses" shows as "Delivered" in the app, but I haven\'t received anything at my door.', 
                time: '10:44 AM' 
            }
        ]
    }
];
