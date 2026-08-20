import { useState } from 'react';
import { GoQuestion } from 'react-icons/go';
import PageHeader from '../../components/ui/PageHeader';
import Pagination from '../../components/ui/Pagination';
import { useGetFAQQuery } from '../../features/faq/faqApi';

const FAQs = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const { data: faqRes, isLoading, isError } = useGetFAQQuery(currentPage);

    const faqs = faqRes?.data || [];
    const meta = faqRes?.meta;

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    return (
        <div className="space-y-6">
            <PageHeader
                title="Frequently Asked Questions"
                subtitle="View common questions and instructions visible to consumers."
            />

            {/* FAQ List */}
            <div className="space-y-4">
                {isLoading ? (
                    <div className="bg-white rounded-2xl p-8 text-center text-[#242424B2] border border-[#FFD2D6]/40 shadow-sm">
                        Loading FAQs...
                    </div>
                ) : isError ? (
                    <div className="bg-white rounded-2xl p-8 text-center text-red-500 border border-red-100 shadow-sm">
                        Failed to load FAQs. Please try again later.
                    </div>
                ) : faqs.length === 0 ? (
                    <div className="bg-white rounded-2xl p-8 text-center text-[#242424B2] border border-[#FFD2D6]/40 shadow-sm">
                        No FAQs found.
                    </div>
                ) : (
                    faqs.map((item) => (
                        <div
                            key={item._id || item.id}
                            className="rounded-2xl p-5 flex justify-between items-start gap-4 transition-all duration-300 hover:scale-[1.002] bg-white border border-[#FFD2D6]/40 shadow-[0_4px_20px_rgba(86,0,12,0.03)]"
                        >
                            <div className="w-10 h-10 rounded-full bg-[#56000c]/10 border border-[#56000c]/20 flex items-center justify-center shrink-0 mt-0.5">
                                <GoQuestion color="#56000c" size={18} />
                            </div>

                            <div className="flex-1 min-w-0">
                                <h3 className="text-[#242424] text-base font-bold m-0 break-words">{item.question}</h3>
                                <p className="text-[#242424B2] text-sm leading-relaxed mt-2 break-words m-0">{item.answer}</p>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Pagination */}
            {meta && meta.total > 0 && (
                <Pagination
                    current={meta.page || currentPage}
                    pageSize={meta.limit || 10}
                    total={meta.total}
                    onChange={handlePageChange}
                    light={true}
                />
            )}
        </div>
    );
};

export default FAQs;
