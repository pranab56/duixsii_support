import Search from '../../components/ui/Search';
import { ChatSidebarProps } from './chats.types';

export const ChatSidebar = ({
    filteredChats,
    selectedChatKey,
    onSelectChat,
    searchQuery,
    onSearchChange,
    activeTab,
    onTabChange,
    getAvatarBg,
    activeChatsCount,
    solvedChatsCount = 0,
    isLoading = false,
}: ChatSidebarProps) => {
    return (
        <div className="w-full lg:w-80 xl:w-96 flex flex-col bg-white rounded-2xl border border-[#FFD2D6]/40 shadow-[0_4px_20px_rgba(86,0,12,0.03)] flex-shrink-0 overflow-hidden">
            {/* Header Section */}
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                <h3 className="text-lg font-bold text-[#242424] m-0">Inbox</h3>
                {activeChatsCount > 0 && (
                    <span className="bg-[#56000c] text-white text-[10px] px-2.5 py-0.5 rounded-full font-bold">
                        {activeChatsCount} Active
                    </span>
                )}
            </div>

            {/* Search Section */}
            <div className="p-3 border-b border-gray-100 bg-white">
                <Search
                    value={searchQuery}
                    onChange={onSearchChange}
                    placeholder="Search by name, ID, or subject..."
                    className="!max-w-none text-xs"
                    inputClassName="bg-[#FFE5E7]/40 border border-[#FFD2D6]/60 text-[#242424] placeholder-gray-400 focus:border-[#56000c] focus:bg-white text-xs"
                    iconColor="text-gray-400"
                />
            </div>

            {/* Tab Switcher */}
            <div className="flex border-b border-gray-100 justify-around text-xs font-semibold text-gray-500">
                <button
                    onClick={() => onTabChange('active')}
                    className={`py-3 px-2 flex-1 text-center border-b-2 transition flex items-center justify-center gap-1.5 cursor-pointer ${
                        activeTab === 'active'
                            ? 'border-[#56000c] text-[#56000c] font-bold'
                            : 'border-transparent text-gray-400 hover:text-gray-600 hover:bg-gray-50/50'
                    }`}
                >
                    <span>Active</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold transition-colors ${
                        activeTab === 'active' ? 'bg-[#56000c] text-white' : 'bg-gray-100 text-gray-500'
                    }`}>
                        {activeChatsCount}
                    </span>
                </button>

                <button
                    onClick={() => onTabChange('resolved')}
                    className={`py-3 px-2 flex-1 text-center border-b-2 transition flex items-center justify-center gap-1.5 cursor-pointer ${
                        activeTab === 'resolved'
                            ? 'border-[#56000c] text-[#56000c] font-bold'
                            : 'border-transparent text-gray-400 hover:text-gray-600 hover:bg-gray-50/50'
                    }`}
                >
                    <span>Solved</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold transition-colors ${
                        activeTab === 'resolved' ? 'bg-[#56000c] text-white' : 'bg-gray-100 text-gray-500'
                    }`}>
                        {solvedChatsCount}
                    </span>
                </button>
            </div>

            {/* Chats scroll area */}
            <div className="flex-1 overflow-y-auto divide-y divide-gray-100 custom-scrollbar">
                {isLoading ? (
                    <div className="p-8 text-center text-gray-400 text-sm">
                        Loading conversations...
                    </div>
                ) : filteredChats.length === 0 ? (
                    <div className="p-8 text-center text-gray-400 text-sm">
                        No conversations found
                    </div>
                ) : (
                    filteredChats.map((chat) => {
                        const isSelected = Boolean(
                            selectedChatKey && (
                                chat.key === selectedChatKey ||
                                chat.chatId === selectedChatKey ||
                                chat.receiverId === selectedChatKey
                            )
                        );
                        const isUnread = Boolean(chat.unreadCount && chat.unreadCount > 0 && !isSelected);
                        const avatarBg = getAvatarBg(chat.userName);

                        return (
                            <div
                                key={chat.key}
                                onClick={() => onSelectChat(chat.key)}
                                className={`p-4 cursor-pointer transition flex gap-3 items-start border-b border-gray-100 ${
                                    isSelected 
                                        ? 'bg-[#FFE5E7] border-l-4 border-l-[#56000c] pl-3.5 shadow-sm' 
                                        : isUnread
                                            ? 'bg-[#FFF9FA] border-l-4 border-l-[#ff4b72] hover:bg-[#FFF2F4]'
                                            : 'hover:bg-gray-50 bg-white'
                                }`}
                            >
                                {/* User Initials / Image Avatar */}
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 text-white ${avatarBg}`}>
                                    {chat.userName ? chat.userName.split(' ').map(n => n[0]).join('').toUpperCase() : 'U'}
                                </div>

                                {/* Content info */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-baseline mb-1">
                                        <h4 className={`text-sm truncate pr-2 ${
                                            isUnread 
                                                ? 'font-extrabold text-[#56000c]' 
                                                : isSelected 
                                                    ? 'font-bold text-[#242424]' 
                                                    : 'font-semibold text-[#242424]'
                                        }`}>
                                            {chat.userName}
                                        </h4>
                                        <span className={`text-[10px] whitespace-nowrap ${
                                            isUnread ? 'font-extrabold text-[#56000c]' : 'text-gray-400 font-medium'
                                        }`}>
                                            {chat.lastMessageTime}
                                        </span>
                                    </div>
                                    <p className={`text-xs truncate mb-1 ${
                                        isUnread 
                                            ? 'font-extrabold text-[#111111]' 
                                            : 'text-gray-500 font-normal'
                                    }`}>
                                        {chat.lastMessage}
                                    </p>
                                    {isUnread && (
                                        <div className="flex items-center justify-between mt-1.5">
                                            <span className="text-[9px] bg-[#56000c]/10 text-[#56000c] px-2 py-0.5 rounded font-black uppercase tracking-wider">
                                                New Message
                                            </span>
                                            <span className="bg-[#56000c] text-white text-[10px] min-w-4.5 h-4 px-1 rounded-full flex items-center justify-center font-black shadow-sm">
                                                {chat.unreadCount}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default ChatSidebar;
