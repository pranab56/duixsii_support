import { useState } from 'react';
import Swal from 'sweetalert2';
import PageHeader from '../../components/ui/PageHeader';
import Pagination from '../../components/ui/Pagination';
import Search from '../../components/ui/Search';
import Toast from '../../components/ui/Toast';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import {
    useGetAllTicketQuery,
    useAssignTicketMutation,
    TicketItem,
} from '../../features/manager/ticket/ticketApi';
import {
    useGetAllSupportAgentQuery,
    SupportAgentUser
} from '../../features/users/usersApi';
import AgentSelect from '../../components/ui/AgentSelect';

const TicketAssignment = () => {
    const [activeTab, setActiveTab] = useState<'Unassigned' | 'Assigned'>('Unassigned');
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const pageSize = 10;

    // Toast State
    const [toast, setToast] = useState('');

    const showToast = (msg: string) => {
        setToast(msg);
        setTimeout(() => setToast(''), 3000);
    };

    // API Hooks
    const { data: unassignedRes, isLoading: isUnassignedLoading, isFetching: isUnassignedFetching } = useGetAllTicketQuery({
        page: activeTab === 'Unassigned' ? page : 1,
        type: 'unassigned',
    });

    const { data: assignedRes, isLoading: isAssignedLoading, isFetching: isAssignedFetching } = useGetAllTicketQuery({
        page: activeTab === 'Assigned' ? page : 1,
        type: 'assigned',
    });

    const { data: supportAgentRes, isLoading: isAgentsLoading } = useGetAllSupportAgentQuery();
    const [assignTicket] = useAssignTicketMutation();

    const isTicketsLoading = (isUnassignedLoading && activeTab === 'Unassigned') || (isAssignedLoading && activeTab === 'Assigned');
    const isTicketsFetching = activeTab === 'Unassigned' ? isUnassignedFetching : isAssignedFetching;

    // Local state for selected agent per ticket: { [chatId]: agentId }
    const [selectedAgents, setSelectedAgents] = useState<Record<string, string>>({});
    // Local state for currently assigning ticket ID to scope button loading
    const [assigningTicketId, setAssigningTicketId] = useState<string | null>(null);

    const unassignedTickets: TicketItem[] = unassignedRes?.data?.result || [];
    const assignedTickets: TicketItem[] = assignedRes?.data?.result || [];
    const allAgents: SupportAgentUser[] = supportAgentRes?.data?.result || [];

    const unassignedTotal = unassignedRes?.data?.meta?.total ?? unassignedTickets.length;
    const assignedTotal = assignedRes?.data?.meta?.total ?? assignedTickets.length;

    const currentTabTickets = activeTab === 'Unassigned' ? unassignedTickets : assignedTickets;

    // Client-side search filtering
    const filteredTickets = currentTabTickets.filter((ticket) => {
        const participant = ticket.participants?.[0];
        const searchLower = search.toLowerCase();
        const ticketId = ticket._id.toLowerCase();
        const name = participant?.fullName?.toLowerCase() || '';
        const email = participant?.email?.toLowerCase() || '';
        return ticketId.includes(searchLower) || name.includes(searchLower) || email.includes(searchLower);
    });

    const totalCount = search ? filteredTickets.length : (activeTab === 'Unassigned' ? unassignedTotal : assignedTotal);
    const paginatedTickets = search ? filteredTickets.slice((page - 1) * pageSize, page * pageSize) : filteredTickets;

    // Handle agent dropdown select
    const handleAgentChange = (chatId: string, agentId: string) => {
        setSelectedAgents((prev) => ({
            ...prev,
            [chatId]: agentId,
        }));
    };

    // Handle click on Assign / Reassign button
    const handleAssignClick = async (ticket: TicketItem) => {
        const agentIdToAssign = selectedAgents[ticket._id] || ticket.assignSupportAgentId || '';

        if (!agentIdToAssign || agentIdToAssign === 'Unassigned') {
            showToast('Please select an agent to assign the ticket.');
            return;
        }

        const selectedAgentObj = allAgents.find(a => a._id === agentIdToAssign);
        const agentName = selectedAgentObj?.fullName || 'Agent';

        setAssigningTicketId(ticket._id);

        try {
            const res = await assignTicket({
                chatId: ticket._id,
                assignAgentId: agentIdToAssign,
            }).unwrap();

            Swal.fire({
                title: 'Success!',
                text: res?.message || `Ticket successfully assigned to ${agentName}`,
                icon: 'success',
                timer: 1500,
                showConfirmButton: false,
            });
        } catch (err: any) {
            Swal.fire({
                title: 'Assignment Failed',
                text: err?.data?.message || err?.message || 'Failed to assign ticket. Please try again.',
                icon: 'error',
            });
        } finally {
            setAssigningTicketId(null);
        }
    };

    if (isTicketsLoading || isAgentsLoading) {
        return (
            <div className="py-12">
                <LoadingSpinner text="Loading ticket assignments..." />
            </div>
        );
    }

    return (
        <div className="space-y-6 pb-6 relative">
            <Toast message={toast} />

            {/* Page Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <PageHeader
                    title="Ticket Assignment"
                    subtitle="Manage and distribute unassigned tickets across support agent teams."
                />

                {/* Segmented Buttons / Tabs */}
                <div className="flex bg-[#FFF0F1] border border-[#FFD2D6]/40 p-1 rounded-xl shrink-0">
                    <button
                        onClick={() => { setActiveTab('Unassigned'); setPage(1); }}
                        className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all cursor-pointer border-0 outline-none ${activeTab === 'Unassigned'
                            ? 'bg-white text-[#56000c] shadow-[0_2px_8px_rgba(86,0,12,0.08)]'
                            : 'text-gray-500 hover:text-[#56000c]'
                            }`}
                    >
                        Unassigned ({unassignedTotal})
                    </button>
                    <button
                        onClick={() => { setActiveTab('Assigned'); setPage(1); }}
                        className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all cursor-pointer border-0 outline-none ${activeTab === 'Assigned'
                            ? 'bg-white text-[#56000c] shadow-[0_2px_8px_rgba(86,0,12,0.08)]'
                            : 'text-gray-500 hover:text-[#56000c]'
                            }`}
                    >
                        Assigned ({assignedTotal})
                    </button>
                </div>
            </div>

            {/* Table / Content Container */}
            <div className="bg-white rounded-2xl flex flex-col gap-6 shadow-[0_4px_20px_rgba(86,0,12,0.03)] border border-[#FFD2D6]/40 p-6 relative">
                {isTicketsFetching && (
                    <div className="absolute top-2 right-4 text-xs text-[#56000c] font-semibold animate-pulse">
                        Refreshing tickets...
                    </div>
                )}

                {/* Search Bar */}
                <Search
                    value={search}
                    onChange={(val) => { setSearch(val); setPage(1); }}
                    placeholder="Search by ticket ID, customer name or email..."
                    inputClassName="bg-[#FFE5E7]/30 border border-[#FFD2D6]/60 text-[#242424] placeholder-gray-400 focus:border-[#56000c] focus:bg-white text-sm"
                    iconColor="text-[#56000c]/60"
                />

                {/* Ticket List */}
                <div className="flex flex-col">
                    {paginatedTickets.length > 0 ? (
                        paginatedTickets.map((ticket, index) => {
                            const participant = ticket.participants?.[0] || {};
                            const customerName = participant.fullName || 'Unknown Customer';
                            const customerEmail = participant.email || '';
                            const assignedAgentId = selectedAgents[ticket._id] ?? ticket.assignSupportAgentId ?? 'Unassigned';
                            const assignedAgent = allAgents.find(a => a._id === ticket.assignSupportAgentId);

                            const formattedDate = ticket.createdAt
                                ? new Date(ticket.createdAt).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })
                                : 'N/A';

                            return (
                                <div
                                    key={ticket._id}
                                    className={`flex flex-col sm:flex-row items-start sm:items-center justify-between py-5 gap-4 ${index !== paginatedTickets.length - 1 ? 'border-b border-[#FFD2D6]/20' : ''
                                        }`}
                                >
                                    {/* Left Side: Details */}
                                    <div className="flex items-center gap-4 text-left">
                                        {participant.profile ? (
                                            <img
                                                src={participant.profile}
                                                alt={customerName}
                                                className="w-10 h-10 rounded-full object-cover border border-[#FFD2D6] shrink-0"
                                                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                                            />
                                        ) : (
                                            <div className="w-10 h-10 rounded-full bg-[#56000c] text-white text-sm font-bold flex items-center justify-center shrink-0">
                                                {customerName.charAt(0).toUpperCase()}
                                            </div>
                                        )}
                                        <div>
                                            <h4 className="text-base font-bold text-[#242424] m-0">
                                                Ticket #{ticket._id.slice(-6)} - {customerName}
                                            </h4>
                                            <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                                                <span>{customerEmail}</span>
                                                <span>• Updated {formattedDate}</span>
                                                {assignedAgent && (
                                                    <span className="text-[#56000c] font-semibold bg-[#FFE5E7] px-2 py-0.5 rounded-md">
                                                        Assigned to: {assignedAgent.fullName}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right Side: Assign Agent Dropdown & Button */}
                                    <div className="flex items-center gap-6 w-full sm:w-auto shrink-0 justify-between sm:justify-end">
                                        {/* Assign Agent Select */}
                                        <div className="flex flex-col text-left">
                                            <span className="text-xs font-semibold text-gray-400 mb-1">
                                                Assign Agent
                                            </span>
                                            <AgentSelect
                                                value={assignedAgentId}
                                                onChange={(agentId) => handleAgentChange(ticket._id, agentId)}
                                                agents={allAgents}
                                                placeholder="Select Agent..."
                                            />
                                        </div>

                                        {/* Assign / Reassign Button */}
                                        <div className="flex flex-col justify-end pt-5">
                                            <button
                                                disabled={!!assigningTicketId}
                                                onClick={() => handleAssignClick(ticket)}
                                                className="h-10 px-6 rounded-xl text-sm font-bold text-white transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer border-0 outline-none uppercase shrink-0 disabled:opacity-50"
                                                style={{ background: '#56000c' }}
                                            >
                                                {assigningTicketId === ticket._id ? 'Assigning...' : (ticket.assignSupportAgentId ? 'Reassign' : 'Assign')}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="py-12 text-center text-gray-400 text-sm">
                            No tickets found matching your search.
                        </div>
                    )}
                </div>

                {/* Pagination */}
                {totalCount > pageSize && (
                    <Pagination
                        current={page}
                        pageSize={pageSize}
                        total={totalCount}
                        onChange={(p) => setPage(p)}
                        light={true}
                    />
                )}
            </div>
        </div>
    );
};

export default TicketAssignment;
