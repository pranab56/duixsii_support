import React from 'react';
import { useGetOverviewQuery, AgentProductivityItem } from '../../features/manager/overview/overviewApi';

const ManagerProductivity: React.FC = () => {
    const { data: overviewRes, isLoading } = useGetOverviewQuery();
    const productivityList: AgentProductivityItem[] = overviewRes?.data?.agentProductivity || [];

    if (isLoading) {
        return <div className="p-6 text-center text-gray-400 text-sm">Loading productivity...</div>;
    }

    return (
        <div className="bg-white rounded-2xl p-6 border border-[#FFD2D6]/40 shadow-[0_4px_20px_rgba(86,0,12,0.03)] mt-6 flex flex-col gap-6">
            <div>
                <h3 className="text-xl font-bold text-[#242424] m-0">Agent Productivity</h3>
            </div>

            <div className="flex flex-col gap-5">
                {productivityList.length === 0 ? (
                    <div className="py-6 text-center text-gray-400 text-sm">No productivity data available yet.</div>
                ) : (
                    productivityList.map((agent) => (
                        <div key={agent.agentId} className="flex flex-col gap-2">
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                    {agent.profile ? (
                                        <img 
                                            src={agent.profile} 
                                            alt={agent.fullName} 
                                            className="w-6 h-6 rounded-full object-cover border border-gray-200" 
                                            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                                        />
                                    ) : (
                                        <div className="w-6 h-6 rounded-full bg-[#56000c] text-white text-[10px] font-bold flex items-center justify-center">
                                            {agent.fullName ? agent.fullName.charAt(0) : 'A'}
                                        </div>
                                    )}
                                    <span className="text-sm font-bold text-[#242424]">{agent.fullName}</span>
                                </div>
                                <div className="flex items-center gap-3 text-xs font-semibold text-[#242424B2]">
                                    <span>{agent.totalSolvedChat} / {agent.totalAssignedChat} Solved</span>
                                    <span className="text-[#56000c] font-bold">{agent.solveRate}%</span>
                                </div>
                            </div>
                            <div className="w-full bg-[#FFF0F2] h-2.5 rounded-full overflow-hidden">
                                <div 
                                    className="bg-[#56000c] h-full rounded-full transition-all duration-500" 
                                    style={{ width: `${Math.min(100, Math.max(0, agent.solveRate))}%` }}
                                />
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default ManagerProductivity;
