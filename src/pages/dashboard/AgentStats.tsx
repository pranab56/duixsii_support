import React from 'react';
import { useGetOverviewQuery } from '../../features/agent/overview/overviewApi';

const AgentStats: React.FC = () => {
    const { data: overviewRes, isLoading } = useGetOverviewQuery();
    const overview = overviewRes?.data;

    const stats = [
        { 
            name: 'Active Chats', 
            count: isLoading ? '...' : (overview?.activeChats ?? overview?.pendingChats ?? 0) 
        },
        { 
            name: 'Pending Chats', 
            count: isLoading ? '...' : (overview?.pendingChats ?? 0) 
        },
        { 
            name: 'Solved Chats', 
            count: isLoading ? '...' : (overview?.solvedChats ?? 0) 
        },
        { 
            name: 'Avg. Rating', 
            count: isLoading ? '...' : (overview?.avarageRating ?? overview?.averageRating ?? 0) 
        },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((item, index) => (
                <div 
                    key={index} 
                    className="bg-white rounded-2xl p-6 border border-[#FFD2D6]/40 shadow-[0_4px_20px_rgba(86,0,12,0.03)] transition-all duration-300 hover:scale-[1.02] flex flex-col justify-between"
                    style={{ minHeight: '130px' }}
                >
                    <span className="text-[#242424B2] text-sm font-medium tracking-wide">
                        {item.name}
                    </span>
                    <span className="text-[#242424] text-[38px] font-bold mt-2 font-sans tracking-tight leading-none">
                        {item.count}
                    </span>
                </div>
            ))}
        </div>
    );
};

export default AgentStats;
