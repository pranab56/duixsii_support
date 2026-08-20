import React, { useState } from 'react';
import { FiArrowLeft } from 'react-icons/fi';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { useGetSingleAgentQuery } from '../../features/manager/agentManagement/agentManagementApi';
import { ManagerAgent } from './agent-management.types';
import AgentHeaderBanner from './agent-menagement-details/AgentHeaderBanner';
import AgentMetricsGrid from './agent-menagement-details/AgentMetricsGrid';
import PerformanceReportChart from './agent-menagement-details/PerformanceReportChart';
import ActivityLogTable from './agent-menagement-details/ActivityLogTable';
import RatingDistributionCard from './agent-menagement-details/RatingDistributionCard';
import FeedbackCardList from './agent-menagement-details/FeedbackCardList';

interface AgentPerformanceDetailsProps {
    agentId: string;
    onBack: () => void;
}

export const AgentPerformanceDetails: React.FC<AgentPerformanceDetailsProps> = ({
    agentId,
    onBack
}) => {
    const [performanceTab, setPerformanceTab] = useState<'Daily' | 'Weekly' | 'Monthly'>('Monthly');

    // Fetch real single agent details API
    const { data: singleAgentRes, isLoading } = useGetSingleAgentQuery(agentId);
    const singleData = singleAgentRes?.data;
    const agentDetails = singleData?.agent;

    if (isLoading) {
        return (
            <div className="py-12">
                <LoadingSpinner text="Loading agent details & metrics..." />
            </div>
        );
    }

    // Map API response to chartData
    const chartData = (singleData?.performanceReports || []).map((item) => ({
        time: item.day ? item.day.slice(5) : '', // Format "2026-08-16" -> "08-16"
        solved: item.count || 0,
    }));

    // Map ratingDistribution
    const totalRatingCount = (singleData?.rattingDistribution || []).reduce((acc, curr) => acc + curr.count, 0);
    const ratingDistribution = (singleData?.rattingDistribution || []).map((item) => ({
        stars: item.rating,
        percentage: totalRatingCount > 0 ? Math.round((item.count / totalRatingCount) * 100) : 0,
    }));

    // Map recentReviews to feedbacks
    const feedbacks = (singleData?.recentReviews || []).map((rev) => ({
        id: rev._id,
        author: rev.userId?.fullName || 'Customer',
        rating: rev.rating || 5,
        text: rev.review || '',
        time: rev.createdAt ? new Date(rev.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' }) : '',
    }));

    // Calculate average rating score
    const avgRating = feedbacks.length > 0
        ? (feedbacks.reduce((acc, f) => acc + f.rating, 0) / feedbacks.length).toFixed(1)
        : '5.0';

    const selectedAgent: ManagerAgent = {
        key: agentDetails?._id || agentId,
        agentId: (agentDetails?._id || agentId).slice(-6).toUpperCase(),
        name: agentDetails?.fullName || 'Support Agent',
        email: agentDetails?.email || '',
        phone: '',
        role: 'Support Agent',
        status: (agentDetails?.agentStatus === 'online' ? 'Online' : (agentDetails?.agentStatus === 'busy' ? 'Busy' : 'Offline')),
        activeChats: 0,
        maxChats: 10,
        avgResponseTime: '12m',
        resolvedToday: singleData?.totalChatHandled || 0,
        csatScore: 98,
        avatar: agentDetails?.profile || '/user.svg',
        totalChatsHandled: singleData?.totalChatHandled || 0,
        avgChatHandling: '15m',
        rateScore: parseFloat(avgRating),
        chartData,
        ratingDistribution,
        feedbacks,
        activityLog: [],
    };

    return (
        <div className="space-y-6 pb-6 relative">
            {/* Back Button and Header */}
            <div className="flex items-center gap-3">
                <button
                    onClick={onBack}
                    className="w-10 h-10 rounded-xl bg-white border border-[#FFD2D6]/40 flex items-center justify-center text-[#56000c] hover:bg-[#56000c]/5 transition-all cursor-pointer shrink-0"
                >
                    <FiArrowLeft size={18} />
                </button>
                <div>
                    <h2 className="text-2xl font-bold text-[#242424] text-left m-0">Agent Performance</h2>
                    <p className="text-xs text-gray-500 text-left mt-0.5">Detailed metrics and review summary for {selectedAgent.name}.</p>
                </div>
            </div>

            {/* Agent Profile Banner Card */}
            <AgentHeaderBanner selectedAgent={selectedAgent} />

            {/* Performance Metrics Stats Cards */}
            <AgentMetricsGrid selectedAgent={selectedAgent} />

            {/* Split Details Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    {/* Performance reports bar chart */}
                    <PerformanceReportChart
                        chartData={selectedAgent.chartData}
                        performanceTab={performanceTab}
                        setPerformanceTab={setPerformanceTab}
                    />

                    {/* Detailed Activity Log Table */}
                    <ActivityLogTable activityLog={selectedAgent.activityLog} />
                </div>

                {/* Right Column (Ratings and Recent Feedback) */}
                <div className="space-y-6">
                    {/* Rating Distribution Card */}
                    <RatingDistributionCard ratingDistribution={selectedAgent.ratingDistribution} />

                    {/* Feedback Card List */}
                    <FeedbackCardList
                        feedbacks={selectedAgent.feedbacks}
                        totalChatsHandled={selectedAgent.totalChatsHandled}
                    />
                </div>
            </div>
        </div>
    );
};

export default AgentPerformanceDetails;
