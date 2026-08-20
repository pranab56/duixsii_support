import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useGetOverviewQuery, RecentTicketItem } from '../../features/manager/overview/overviewApi';

const ManagerTickets: React.FC = () => {
    const navigate = useNavigate();
    const { data: overviewRes, isLoading } = useGetOverviewQuery();
    const recentTickets: RecentTicketItem[] = overviewRes?.data?.recentTickets || [];

    if (isLoading) {
        return <div className="p-6 text-center text-gray-400 text-sm">Loading recent tickets...</div>;
    }

    return (
        <div className="bg-white rounded-2xl p-6 border border-[#FFD2D6]/40 shadow-[0_4px_20px_rgba(86,0,12,0.03)] mt-6 flex flex-col gap-5">
            <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-[#242424] m-0">Recent Assigned Tickets</h3>
                <Link to="/chats" className="text-[#ff4d4f] hover:text-[#56000c] transition-colors text-sm font-semibold">
                    View All Chats
                </Link>
            </div>

            <div className="flex flex-col gap-4">
                {recentTickets.length === 0 ? (
                    <div className="py-6 text-center text-gray-400 text-sm">No recent tickets available.</div>
                ) : (
                    recentTickets.map((ticket) => {
                        const participant = ticket.participants?.[0] || {};
                        const name = participant.fullName || 'Customer';
                        const email = participant.email || '';
                        const timeStr = ticket.createdAt 
                            ? new Date(ticket.createdAt).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })
                            : '';

                        return (
                            <div 
                                key={ticket._id} 
                                className="p-4 rounded-xl flex items-center justify-between bg-[#FFF8F5] border border-[#FFEAEA] transition-all duration-300 hover:shadow-sm"
                            >
                                <div className="flex items-center gap-3">
                                    {participant.profile ? (
                                        <img 
                                            src={participant.profile} 
                                            alt={name} 
                                            className="w-10 h-10 rounded-full object-cover border border-gray-200 shrink-0" 
                                            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                                        />
                                    ) : (
                                        <div className="w-10 h-10 rounded-full bg-[#56000c] text-white text-xs font-bold flex items-center justify-center shrink-0">
                                            {name.charAt(0).toUpperCase()}
                                        </div>
                                    )}
                                    <div className="flex flex-col text-left">
                                        <h4 className="text-[#242424] text-sm font-bold m-0">{name}</h4>
                                        <span className="text-[#242424B2] text-xs font-medium">{email}</span>
                                        <span className="text-gray-400 text-[10px] mt-0.5">{timeStr}</span>
                                    </div>
                                </div>

                                <button 
                                    onClick={() => navigate('/chats', { state: { chatId: ticket._id } })}
                                    className="h-9 px-5 rounded-lg text-white font-bold text-xs transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                                    style={{
                                        background: '#56000c'
                                    }}
                                >
                                    Open Chat
                                </button>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default ManagerTickets;
