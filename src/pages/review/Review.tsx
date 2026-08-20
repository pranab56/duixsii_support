import { useState } from 'react';
import { FiMessageSquare } from 'react-icons/fi';
import { AiFillStar } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../../components/ui/PageHeader';
import Table from '../../components/ui/Table';
import Pagination from '../../components/ui/Pagination';
import Search from '../../components/ui/Search';
import { useGetRatingQuery, IReviewItem } from '../../features/agent/rating/ratingApi';

const Review = () => {
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const navigate = useNavigate();

    const { data: response, isLoading, isError } = useGetRatingQuery(page);
    const reviews = response?.data || [];
    const meta = response?.meta;

    // Filter reviews based on search query
    const filteredReviews = reviews.filter((item) => {
        const userName = item.userId?.fullName || item.userId?.name || '';
        const chatId = item.userId?.chatId || '';
        const reviewText = item.review || '';
        const query = search.toLowerCase();

        return (
            userName.toLowerCase().includes(query) ||
            chatId.toLowerCase().includes(query) ||
            reviewText.toLowerCase().includes(query)
        );
    });

    const columns = [
        {
            title: 'User',
            key: 'user',
            render: (record: IReviewItem) => {
                const name = record.userId?.fullName || record.userId?.name || 'Customer';
                return (
                    <div className="flex items-center gap-3 select-none">
                        <div className="w-8 h-8 rounded-full bg-[#f97316] flex items-center justify-center text-white text-xs font-bold shrink-0">
                            {name.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-[#242424] text-sm font-bold">{name}</span>
                    </div>
                );
            }
        },
        {
            title: 'Date',
            key: 'date',
            render: (record: IReviewItem) => {
                const dateStr = record.createdAt 
                    ? new Date(record.createdAt).toLocaleDateString([], { year: 'numeric', month: 'short', day: 'numeric' }) 
                    : 'N/A';
                return (
                    <span className="text-gray-600 text-sm font-medium">
                        {dateStr}
                    </span>
                );
            }
        },
        {
            title: 'Given Rate',
            dataIndex: 'rating',
            key: 'rating',
            render: (rating: number) => (
                <div className="flex items-center gap-1.5">
                    <AiFillStar className="text-amber-500" size={18} />
                    <span className="text-[#242424] text-sm font-bold">{(rating || 0).toFixed(1)}</span>
                </div>
            )
        },
        {
            title: 'Review Message',
            dataIndex: 'review',
            key: 'review',
            render: (review: string) => (
                <span className="text-gray-600 text-sm block truncate max-w-xs" title={review}>
                    {review || '—'}
                </span>
            )
        },
        {
            title: 'Chat History',
            key: 'chatHistory',
            render: (record: IReviewItem) => {
                const userObj = record.userId || record.user;
                return (
                    <button
                        onClick={() => navigate('/chats', { 
                            state: { 
                                chatId: userObj?.chatId,
                                userId: userObj?._id,
                                userName: userObj?.fullName || userObj?.name
                            } 
                        })}
                        className="w-14 h-8 rounded-lg flex items-center justify-center text-white transition-all hover:opacity-90 active:scale-95 cursor-pointer border-0 outline-none"
                        style={{ background: '#56000c' }}
                        title="View Chat History"
                    >
                        <FiMessageSquare size={16} />
                    </button>
                );
            }
        }
    ];

    return (
        <div className="space-y-6 pb-6 relative">
            <PageHeader 
                title="Rating & Feedback" 
                subtitle="Track all customers given rating & feedback" 
            />

            {/* Content Table Area */}
            <div
                className="bg-white rounded-2xl flex flex-col gap-6 shadow-[0_4px_20px_rgba(86,0,12,0.03)] border border-[#FFD2D6]/40"
            >
                <div className="flex flex-col sm:flex-row gap-4 justify-between items-center p-6 pb-0">
                    <Search
                        value={search}
                        onChange={(val) => setSearch(val)}
                        placeholder="Search reviews by user name, chat ID, or message..."
                        inputClassName="bg-[#FFE5E7]/40 border border-[#FFD2D6] text-[#333333] placeholder-gray-400 focus:border-[#56000c]"
                        iconColor="text-[#56000c]/60"
                    />
                </div>

                <div className="overflow-x-auto px-6">
                    {isLoading ? (
                        <div className="py-12 text-center text-gray-500 font-medium">Loading ratings and reviews...</div>
                    ) : isError ? (
                        <div className="py-12 text-center text-red-500 font-medium">Failed to load reviews. Please try again.</div>
                    ) : filteredReviews.length === 0 ? (
                        <div className="py-12 text-center text-gray-400 font-medium">No reviews found.</div>
                    ) : (
                        <Table
                            dataSource={filteredReviews}
                            columns={columns}
                            rowKey={(record: IReviewItem) => record._id}
                            light={true}
                            pagination={false}
                        />
                    )}
                </div>

                {meta && meta.total > 0 && (
                    <Pagination
                        current={meta.page || page}
                        pageSize={meta.limit || 10}
                        total={meta.total}
                        onChange={(p) => setPage(p)}
                        light={true}
                    />
                )}
            </div>
        </div>
    );
};

export default Review;
