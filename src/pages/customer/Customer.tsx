import { useState } from 'react';
import { FiMessageSquare } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../../components/ui/PageHeader';
import Table from '../../components/ui/Table';
import Pagination from '../../components/ui/Pagination';
import Search from '../../components/ui/Search'; 
import { useGetCustomerQuery, CustomerItem } from '../../features/agent/customer/customerApi';
import { baseURL } from '../../utils/BaseURL';

const Customer = () => {
    const { data: customerRes, isLoading } = useGetCustomerQuery();
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const pageSize = 8;
    const navigate = useNavigate();

    const customers: CustomerItem[] = customerRes?.data || [];

    // Filter customers based on search query
    const filteredCustomers = customers.filter(customer => {
        const query = search.toLowerCase();
        return (
            (customer.fullName || '').toLowerCase().includes(query) ||
            (customer.email || '').toLowerCase().includes(query) ||
            (customer.phone || '').toLowerCase().includes(query) ||
            (customer.role || '').toLowerCase().includes(query)
        );
    });

    const paginatedCustomers = filteredCustomers.slice((page - 1) * pageSize, page * pageSize);

    const getImageUrl = (path?: string) => {
        if (!path) return '';
        if (path.startsWith('http://') || path.startsWith('https://')) return path;
        const cleanPath = path.replace(/\\/g, '/');
        const cleanBase = (baseURL || '').endsWith('/') ? baseURL.slice(0, -1) : (baseURL || '');
        return `${cleanBase}/${cleanPath.startsWith('/') ? cleanPath.slice(1) : cleanPath}`;
    };

    const columns = [
        {
            title: 'Customer',
            key: 'customer',
            render: (record: CustomerItem) => {
                const profileUrl = getImageUrl(record.profile);
                const name = record.fullName || 'Customer';
                return (
                    <div className="flex items-center gap-3 select-none">
                        {profileUrl ? (
                            <img 
                                src={profileUrl} 
                                alt={name}
                                className="w-8 h-8 rounded-full object-cover border border-gray-200 shrink-0" 
                            />
                        ) : (
                            <div className="w-8 h-8 rounded-full bg-[#56000c] flex items-center justify-center text-white text-xs font-bold shrink-0">
                                {name.charAt(0).toUpperCase()}
                            </div>
                        )}
                        <span className="text-[#242424] text-sm font-bold">{name}</span>
                    </div>
                );
            }
        },
        {
            title: 'Contact',
            key: 'contact',
            render: (record: CustomerItem) => (
                <div className="flex flex-col text-left">
                    <span className="text-[#242424] text-sm font-semibold">{record.email || 'N/A'}</span>
                    <span className="text-gray-400 text-xs mt-0.5">{record.phone || 'N/A'}</span>
                </div>
            )
        },
        {
            title: 'Role',
            dataIndex: 'role',
            key: 'role',
            render: (role?: string) => (
                <span className="capitalize text-xs font-bold px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                    {role || 'User'}
                </span>
            )
        },
        {
            title: 'Chat Action',
            key: 'chatAction',
            render: (record: CustomerItem) => (
                <button
                    onClick={() => navigate('/chats', { 
                        state: { 
                            chatId: record.chatId,
                            userId: record.id || record._id,
                            userName: record.fullName 
                        } 
                    })}
                    className="w-10 h-8 rounded-lg flex items-center justify-center text-white transition-all hover:opacity-90 active:scale-95 cursor-pointer border-0 outline-none"
                    style={{ background: '#56000c' }}
                    title="Open Chat"
                >
                    <FiMessageSquare size={16} />
                </button>
            )
        }
    ];

    return (
        <div className="space-y-6">
            <PageHeader 
                title="Customers" 
                subtitle="Track all support customer information" 
            />

            <div 
                className="bg-white rounded-2xl flex flex-col gap-6 shadow-[0_4px_20px_rgba(86,0,12,0.03)] border border-[#FFD2D6]/40"
            >
                {/* Search Row */}
                <div className="flex flex-col sm:flex-row gap-4 justify-between items-center p-6 pb-0">
                    <Search 
                        value={search}
                        onChange={(val) => {
                            setSearch(val);
                            setPage(1);
                        }}
                        placeholder="Search customers by name, email, or phone..."
                        inputClassName="bg-[#FFE5E7]/40 border border-[#FFD2D6] text-[#333333] placeholder-gray-400 focus:border-[#56000c]"
                        iconColor="text-[#56000c]/60"
                    />
                </div>

                <div className="overflow-x-auto px-6">
                    <Table 
                        dataSource={paginatedCustomers} 
                        columns={columns} 
                        rowKey={(record: CustomerItem) => record.id || record._id || record.email}
                        light={true}
                        pagination={false}
                        loading={isLoading}
                    />
                </div>

                <Pagination 
                    current={page}
                    pageSize={pageSize}
                    total={filteredCustomers.length}
                    onChange={(p) => setPage(p)}
                    light={true}
                />
            </div>
        </div>
    );
};

export default Customer;
