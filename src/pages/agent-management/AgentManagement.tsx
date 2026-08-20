import { useState } from 'react';
import PageHeader from '../../components/ui/PageHeader';
import Pagination from '../../components/ui/Pagination';
import Toast from '../../components/ui/Toast';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import AgentStatsCards from './AgentStatsCards';
import AgentCardsGrid from './AgentCardsGrid';
import AgentPerformanceDetails from './AgentPerformanceDetails';
import { useGetAllAgentQuery, AgentListItem } from '../../features/manager/agentManagement/agentManagementApi';
import { ManagerAgent } from './agent-management.types';

const AgentManagement = () => {
    const [toast, setToast] = useState('');
    const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);
    const [agentPage, setAgentPage] = useState(1);
    const agentPageSize = 4;

    const showToast = (msg: string) => {
        setToast(msg);
        setTimeout(() => setToast(''), 3000);
    };

    // API Hook
    const { data: agentRes, isLoading, isFetching } = useGetAllAgentQuery();
    const agentData = agentRes?.data;

    const allAgents: AgentListItem[] = agentData?.allAgent || [];
    const totalAgentsCount = allAgents.length;
    const onlineCount = agentData?.totalOnlineAgent || 0;
    const busyCount = agentData?.totalBusyAgent || 0;
    const offlineCount = agentData?.totalOfflineAgent || 0;
    const totalActiveChats = allAgents.reduce((acc, a) => acc + (a.totalAssignedChat || 0), 0);
    const avgChatsPerAgent = agentData?.averageAssignedChat 
        ? agentData.averageAssignedChat.toString() 
        : (totalAgentsCount > 0 ? (totalActiveChats / totalAgentsCount).toFixed(1) : '0');

    // Adapt API agents to ManagerAgent interface expected by AgentCardsGrid
    const adaptedAgents: ManagerAgent[] = allAgents.map((agent) => {
        const rawStatus = (agent.agentStatus || 'offline').toLowerCase();
        let status: 'Online' | 'Busy' | 'Offline' = 'Offline';
        if (rawStatus === 'online') status = 'Online';
        else if (rawStatus === 'busy') status = 'Busy';

        return {
            key: agent.id,
            agentId: agent.id.slice(-6).toUpperCase(),
            name: agent.fullName,
            email: agent.email,
            phone: '',
            role: 'Support Agent',
            status,
            activeChats: agent.totalAssignedChat || 0,
            maxChats: 10,
            avgResponseTime: '12m',
            resolvedToday: agent.totalSolvedChat || 0,
            csatScore: 98,
            avatar: agent.profile || '/user.svg',
            totalChatsHandled: agent.totalSolvedChat || 0,
            avgChatHandling: '15m',
            rateScore: 4.5,
            chartData: [],
            ratingDistribution: [],
            feedbacks: [],
            activityLog: []
        };
    });

    const paginatedAgents = adaptedAgents.slice((agentPage - 1) * agentPageSize, agentPage * agentPageSize);

    // Suspend agent handler placeholder
    const handleSuspendAgent = (agentKey: string) => {
        showToast(`Agent ID ${agentKey.slice(-6)} has been suspended.`);
    };

    // Render Detailed Agent Performance sub-page when selected
    if (selectedAgentId) {
        return (
            <AgentPerformanceDetails
                agentId={selectedAgentId}
                onBack={() => setSelectedAgentId(null)}
            />
        );
    }

    if (isLoading) {
        return (
            <div className="py-12">
                <LoadingSpinner text="Loading agent management data..." />
            </div>
        );
    }

    return (
        <div className="space-y-6 pb-6 relative">
            <Toast message={toast} />

            {/* Page Header */}
            <div className="flex justify-between items-center">
                <PageHeader
                    title="Agent Management"
                    subtitle="Monitor, reassign, and optimize your support team efficiency in real-time."
                />
                {isFetching && (
                    <span className="text-xs text-[#56000c] font-semibold animate-pulse">
                        Updating live data...
                    </span>
                )}
            </div>

            {/* Statistics Cards Row */}
            <AgentStatsCards
                onlineCount={onlineCount}
                busyCount={busyCount}
                totalAgentsCount={totalAgentsCount}
                totalActiveChats={totalActiveChats}
                avgChatsPerAgent={avgChatsPerAgent}
            />

            {/* Agent List / Cards Container */}
            <div className="flex flex-col gap-6">
                <AgentCardsGrid
                    agents={adaptedAgents}
                    paginatedAgents={paginatedAgents}
                    onlineCount={onlineCount}
                    busyCount={busyCount}
                    offlineCount={offlineCount}
                    onViewDetails={(agentKey) => setSelectedAgentId(agentKey)}
                    onSuspendAgent={handleSuspendAgent}
                />

                {/* Pagination */}
                {totalAgentsCount > agentPageSize && (
                    <div className="flex justify-end pr-6">
                        <Pagination
                            current={agentPage}
                            pageSize={agentPageSize}
                            total={totalAgentsCount}
                            onChange={(p) => setAgentPage(p)}
                            light={true}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default AgentManagement;
