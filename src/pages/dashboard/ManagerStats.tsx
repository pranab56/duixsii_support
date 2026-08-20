import React from 'react';
import { FiUsers, FiAlertTriangle, FiStar, FiActivity } from 'react-icons/fi';
import { useGetOverviewQuery } from '../../features/manager/overview/overviewApi';

const ManagerStats: React.FC = () => {
    const { data: overviewRes, isLoading } = useGetOverviewQuery();
    const stats = overviewRes?.data;

    const totalAgent = stats?.totalAgent ?? 0;
    const unassignedAgent = stats?.unassignedAgent ?? 0;
    const avgRating = stats?.averageRating ?? 0;
    const activeProductivityCount = stats?.agentProductivity?.length ?? 0;

    if (isLoading) {
        return <div className="p-4 text-center text-gray-400 text-sm">Loading stats...</div>;
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Card 1: Agent Capacity */}
            <div 
                className="bg-white rounded-2xl p-6 border border-[#FFD2D6]/40 shadow-[0_4px_20px_rgba(86,0,12,0.03)] flex flex-col justify-between"
                style={{ minHeight: '140px' }}
            >
                <div className="flex items-center justify-between">
                    <span className="text-[#242424B2] text-xs font-semibold uppercase tracking-wider">Total Agents</span>
                    <FiUsers className="text-[#3b82f6]" size={20} />
                </div>
                <div className="flex items-baseline justify-start mt-2">
                    <span className="text-[#242424] text-[36px] font-bold tracking-tight leading-none">{totalAgent}</span>
                </div>
                <div className="flex items-center justify-between text-xs text-[#242424B2] font-semibold mt-2">
                    <span>Registered Support Agents</span>
                </div>
            </div>

            {/* Card 2: Unassigned */}
            <div 
                className="bg-white rounded-2xl p-6 border border-[#FFD2D6]/40 shadow-[0_4px_20px_rgba(86,0,12,0.03)] flex flex-col justify-between"
                style={{ minHeight: '140px' }}
            >
                <div className="flex items-center justify-between">
                    <span className="text-[#242424B2] text-xs font-semibold uppercase tracking-wider">Unassigned Agents</span>
                    <FiAlertTriangle className="text-[#ef4444]" size={20} />
                </div>
                <div className="flex items-baseline justify-start mt-2">
                    <span className="text-[#ef4444] text-[36px] font-bold tracking-tight leading-none">{unassignedAgent}</span>
                </div>
                <div className="text-xs text-[#242424B2] font-semibold mt-2 leading-none">
                    Agents awaiting assignment
                </div>
            </div>

            {/* Card 3: Avg Rating */}
            <div 
                className="bg-white rounded-2xl p-6 border border-[#FFD2D6]/40 shadow-[0_4px_20px_rgba(86,0,12,0.03)] flex flex-col justify-between"
                style={{ minHeight: '140px' }}
            >
                <div className="flex items-center justify-between">
                    <span className="text-[#242424B2] text-xs font-semibold uppercase tracking-wider">Avg Rating</span>
                    <FiStar className="text-[#9333ea]" size={20} />
                </div>
                <div className="flex items-baseline justify-start mt-2">
                    <span className="text-[#242424] text-[36px] font-bold tracking-tight leading-none">{Number(avgRating).toFixed(1)}/5.0</span>
                </div>
                <div className="text-xs text-[#242424B2] font-semibold mt-2 leading-none">
                    Team overall rating
                </div>
            </div>

            {/* Card 4: Productive Agents */}
            <div 
                className="bg-white rounded-2xl p-6 border border-[#FFD2D6]/40 shadow-[0_4px_20px_rgba(86,0,12,0.03)] flex flex-col justify-between"
                style={{ minHeight: '140px' }}
            >
                <div className="flex items-center justify-between">
                    <span className="text-[#242424B2] text-xs font-semibold uppercase tracking-wider">Active Productivity</span>
                    <FiActivity className="text-[#0d9488]" size={20} />
                </div>
                <div className="flex items-baseline justify-start mt-2">
                    <span className="text-[#242424] text-[36px] font-bold tracking-tight leading-none">{activeProductivityCount}</span>
                </div>
                <div className="text-xs text-[#242424B2] font-semibold mt-2 leading-none">
                    Agents with assigned chats
                </div>
            </div>
        </div>
    );
};

export default ManagerStats;
