import React from 'react';
import { Link } from 'react-router-dom';
import { useGetOverviewQuery, TicketItem } from '../../features/agent/overview/overviewApi';

const AgentTickets: React.FC = () => {
    const { data: overviewRes, isLoading } = useGetOverviewQuery();
    const tickets = overviewRes?.data?.recentAssignedTickets || [];

    const getTicketName = (ticket: TicketItem) => {
        return ticket.name || ticket.fullName || ticket.userName || ticket.user?.fullName || ticket.user?.name || 'Customer';
    };

    const getTicketMessage = (ticket: TicketItem) => {
        return ticket.message || ticket.lastMessage || ticket.subject || 'No details provided';
    };

    const getTicketTime = (ticket: TicketItem) => {
        if (ticket.time) return ticket.time;
        if (ticket.createdAt) {
            try {
                return new Date(ticket.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            } catch {
                return ticket.createdAt;
            }
        }
        return 'Recently';
    };

    return (
        <div className="bg-white rounded-2xl p-6 border border-[#FFD2D6]/40 shadow-[0_4px_20px_rgba(86,0,12,0.03)] mt-6 flex flex-col gap-5">
            <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-[#242424] m-0">New Assigned Tickets</h3>
                <Link to="/chats" className="text-[#ff4d4f] hover:text-[#56000c] transition-colors text-sm font-semibold">
                    View All
                </Link>
            </div>

            <div className="flex flex-col gap-4">
                {isLoading ? (
                    <div className="py-6 text-center text-sm text-gray-400">Loading assigned tickets...</div>
                ) : tickets.length === 0 ? (
                    <div className="py-6 text-center text-sm text-gray-400">No new assigned tickets</div>
                ) : (
                    tickets.map((ticket, index) => (
                        <div 
                            key={ticket._id || ticket.id || index} 
                            className="p-4 rounded-xl flex items-center justify-between bg-[#FFF8F5] border border-[#FFEAEA] transition-all duration-300 hover:shadow-sm"
                        >
                            <div className="flex flex-col gap-1 text-left">
                                <h4 className="text-[#242424] text-base font-bold m-0">{getTicketName(ticket)}</h4>
                                <span className="text-[#242424B2] text-sm">{getTicketMessage(ticket)}</span>
                                <span className="text-gray-400 text-xs mt-0.5">{getTicketTime(ticket)}</span>
                            </div>
                            <Link to="/chats">
                                <button 
                                    className="h-9 px-6 rounded-lg text-white font-bold text-sm transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                                    style={{
                                        background: '#ff9e59'
                                    }}
                                >
                                    Solve
                                </button>
                            </Link>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default AgentTickets;
