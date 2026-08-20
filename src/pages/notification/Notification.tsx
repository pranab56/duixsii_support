import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoArrowBackOutline } from 'react-icons/io5';
import { FiBell, FiCheckCircle } from 'react-icons/fi';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import Pagination from '../../components/ui/Pagination';
import { 
    useGetAllNotificationQuery, 
    useSingleReadNotificationMutation, 
    useReadAllNotificationMutation,
    NotificationItem 
} from '../../features/notification/notificationApi';

const Notification = () => {  
    const navigate = useNavigate();
    const [page, setPage] = useState(1);

    const { data: res, isLoading, isFetching } = useGetAllNotificationQuery({ page });
    const [singleRead] = useSingleReadNotificationMutation();
    const [readAll, { isLoading: isReadingAll }] = useReadAllNotificationMutation();

    const notifications: NotificationItem[] = res?.data || [];
    const meta = res?.meta;

    const handleReadSingle = async (id: string, isRead: boolean) => {
        if (isRead) return;
        try {
            await singleRead(id).unwrap();
        } catch (err) {
            console.error('Failed to mark notification as read:', err);
        }
    };

    const handleReadAll = async () => {
        try {
            await readAll().unwrap();
        } catch (err) {
            console.error('Failed to mark all as read:', err);
        }
    };

    const hasUnread = notifications.some(item => !item.isRead);

    return (
        <div className="space-y-6 pb-6">
            {/* Header with Back Arrow and Mark All Read button */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                    <button 
                        onClick={() => navigate(-1)} 
                        className="text-[#56000c] hover:text-[#7d1522] transition-colors p-1 mt-0.5 cursor-pointer bg-transparent border-0 outline-none"
                        title="Go Back"
                    >
                        <IoArrowBackOutline size={26} />
                    </button>
                    <div>
                        <h1 className="text-[#333333] font-bold m-0 font-sans text-2xl sm:text-3xl">
                            Notifications
                        </h1>
                        <p className="text-gray-500 m-0 mt-1 font-sans text-sm sm:text-base">
                            See all system notifications and updates
                        </p>
                    </div>
                </div>

                {hasUnread && (
                    <button
                        onClick={handleReadAll}
                        disabled={isReadingAll}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#56000c] hover:bg-[#7a0015] text-white text-xs font-semibold transition cursor-pointer border-0 shadow-sm disabled:opacity-50 self-start sm:self-auto"
                    >
                        <FiCheckCircle size={15} />
                        <span>{isReadingAll ? 'Marking...' : 'Mark all as read'}</span>
                    </button>
                )}
            </div>

            {/* Notifications Cards Container */}
            <div className="bg-white rounded-2xl p-6 shadow-[0_4px_20px_rgba(86,0,12,0.03)] border border-[#FFD2D6]/40 flex flex-col gap-4">
                {isLoading || isFetching ? (
                    <div className="py-12 flex justify-center">
                        <LoadingSpinner text="Loading notifications..." />
                    </div>
                ) : notifications.length === 0 ? (
                    <div className="py-16 text-center text-gray-400 text-sm font-medium">
                        No notifications found.
                    </div>
                ) : (
                    notifications.map((item) => {
                        const dateFormatted = item.createdAt 
                            ? new Date(item.createdAt).toLocaleString([], { 
                                dateStyle: 'medium', 
                                timeStyle: 'short' 
                            })
                            : '';

                        return (
                            <div 
                                key={item._id} 
                                onClick={() => handleReadSingle(item._id, item.isRead)}
                                className={`p-4 rounded-xl flex items-start justify-between gap-4 transition-all border ${
                                    item.isRead 
                                        ? 'bg-white border-gray-100 hover:border-gray-200' 
                                        : 'bg-[#FFF5F6] border-[#FFD2D6] shadow-sm cursor-pointer'
                                }`}
                            >
                                <div className="flex items-start gap-3 flex-1 min-w-0">
                                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                                        item.isRead ? 'bg-gray-100 text-gray-400' : 'bg-[#56000c]/10 text-[#56000c]'
                                    }`}>
                                        <FiBell size={18} />
                                    </div>
                                    <div className="flex flex-col gap-1 min-w-0 flex-1">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <h3 className="text-[#242424] text-sm sm:text-base font-bold m-0 truncate">
                                                {item.title}
                                            </h3>
                                            {!item.isRead && (
                                                <span className="w-2 h-2 rounded-full bg-[#56000c] shrink-0" title="Unread" />
                                            )}
                                            {item.status && (
                                                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 border border-gray-200">
                                                    {item.status}
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-gray-600 text-xs sm:text-sm m-0 leading-relaxed break-words">
                                            {item.message}
                                        </p>
                                        {dateFormatted && (
                                            <span className="text-gray-400 text-[11px] mt-1 font-medium">
                                                {dateFormatted}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}

                {meta && meta.totalPage > 1 && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                        <Pagination 
                            current={meta.page || page}
                            pageSize={meta.limit || 10}
                            total={meta.total}
                            onChange={(p) => setPage(p)}
                            light={true}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default Notification;
