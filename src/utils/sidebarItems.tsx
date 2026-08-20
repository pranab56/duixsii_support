import { RxDashboard } from 'react-icons/rx';
import {
    FiUsers,
    FiMessageSquare,
    FiInfo,
    FiStar,
    FiClipboard
} from 'react-icons/fi';
import { TSidebarItem } from './generateSidebarItems';

export const agentItems: TSidebarItem[] = [
    {
        key: 'dashboard',
        label: 'Dashboard',
        path: '',
        icon: <RxDashboard size={20} />,
    },
    {
        key: 'chats',
        label: 'Live Chats',
        path: 'chats',
        icon: <FiMessageSquare size={20} />,
    },
    {
        key: 'customers',
        label: 'Customers',
        path: 'customers',
        icon: <FiUsers size={20} />,
    },
    {
        key: 'review',
        label: 'Rating & Feedback',
        path: 'review',
        icon: <FiStar size={20} />,
    },
    {
        key: 'faqs',
        label: "FAQ's",
        path: 'faqs',
        icon: <FiInfo size={20} />,
    },
    {
        key: 'privacy',
        label: 'Privacy Policy',
        path: 'privacy',
        icon: <FiInfo size={20} />,
    },
    {
        key: 'terms',
        label: 'Terms & Condition',
        path: 'terms',
        icon: <FiInfo size={20} />,
    },
    {
        key: 'about',
        label: 'About Us',
        path: 'about',
        icon: <FiInfo size={20} />,
    },
];

export const managerItems: TSidebarItem[] = [
    {
        key: 'dashboard',
        label: 'Dashboard',
        path: '',
        icon: <RxDashboard size={20} />,
    },
    {
        key: 'ticket-assignment',
        label: 'Ticket Assignment',
        path: 'ticket-assignment',
        icon: <FiClipboard size={20} />,
    },
    {
        key: 'agent-management',
        label: 'Agent Management',
        path: 'agent-management',
        icon: <FiUsers size={20} />,
    },
    {
        key: 'faqs',
        label: "FAQ's",
        path: 'faqs',
        icon: <FiInfo size={20} />,
    },
    {
        key: 'privacy',
        label: 'Privacy Policy',
        path: 'privacy',
        icon: <FiInfo size={20} />,
    },
    {
        key: 'terms',
        label: 'Terms & Condition',
        path: 'terms',
        icon: <FiInfo size={20} />,
    },
    {
        key: 'about',
        label: 'About Us',
        path: 'about',
        icon: <FiInfo size={20} />,
    },
];

export default agentItems;
