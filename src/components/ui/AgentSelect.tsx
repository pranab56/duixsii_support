import React, { useState, useRef, useEffect } from 'react';
import { FiChevronDown, FiUser, FiCheck, FiSearch } from 'react-icons/fi';
import { SupportAgentUser } from '../../features/users/usersApi';

interface AgentSelectProps {
    value: string; // agent _id or 'Unassigned'
    onChange: (agentId: string) => void;
    agents: SupportAgentUser[];
    placeholder?: string;
    disabled?: boolean;
}

export const AgentSelect: React.FC<AgentSelectProps> = ({
    value,
    onChange,
    agents,
    placeholder = "Select Agent...",
    disabled = false,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState('');
    const dropdownRef = useRef<HTMLDivElement>(null);

    const selectedAgent = agents.find((a) => a._id === value);

    // Close dropdown on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Filter agents by search query
    const filteredAgents = agents.filter((agent) => {
        const query = search.toLowerCase();
        return (
            agent.fullName?.toLowerCase().includes(query) ||
            agent.email?.toLowerCase().includes(query)
        );
    });

    const handleSelect = (agentId: string) => {
        onChange(agentId);
        setIsOpen(false);
        setSearch('');
    };

    return (
        <div className="relative min-w-[220px]" ref={dropdownRef}>
            {/* Main Trigger Button */}
            <button
                type="button"
                disabled={disabled}
                onClick={() => setIsOpen((prev) => !prev)}
                className={`w-full h-11 px-3.5 bg-white border rounded-xl flex items-center justify-between gap-3 text-left transition-all duration-200 cursor-pointer shadow-sm ${
                    isOpen
                        ? 'border-[#56000c] ring-2 ring-[#56000c]/15 shadow-md'
                        : 'border-[#FFD2D6] hover:border-[#56000c]/60 hover:bg-[#FFE5E7]/10'
                } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
                <div className="flex items-center gap-2.5 truncate">
                    {selectedAgent ? (
                        <>
                            {selectedAgent.profile ? (
                                <img
                                    src={selectedAgent.profile}
                                    alt={selectedAgent.fullName}
                                    className="w-6 h-6 rounded-full object-cover border border-[#FFD2D6] shrink-0"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).style.display = 'none';
                                    }}
                                />
                            ) : (
                                <div className="w-6 h-6 rounded-full bg-[#56000c] text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                                    {selectedAgent.fullName?.charAt(0).toUpperCase()}
                                </div>
                            )}
                            <span className="text-sm font-semibold text-[#242424] truncate">
                                {selectedAgent.fullName}
                            </span>
                        </>
                    ) : (
                        <>
                            <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 shrink-0 border border-gray-200">
                                <FiUser size={13} />
                            </div>
                            <span className="text-sm font-medium text-gray-400 truncate">
                                {placeholder}
                            </span>
                        </>
                    )}
                </div>

                <FiChevronDown
                    size={16}
                    className={`text-gray-400 shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-[#56000c]' : ''
                    }`}
                />
            </button>

            {/* Dropdown Menu Panel */}
            {isOpen && (
                <div className="absolute right-0 top-full mt-2 w-full min-w-[240px] bg-white border border-[#FFD2D6]/80 rounded-2xl shadow-[0_10px_30px_rgba(86,0,12,0.12)] p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    {/* Search inside dropdown if there are more than 3 agents */}
                    {agents.length > 3 && (
                        <div className="relative mb-2">
                            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Filter agents..."
                                className="w-full pl-8 pr-3 py-1.5 text-xs bg-[#FFE5E7]/30 border border-[#FFD2D6]/50 rounded-lg text-[#242424] placeholder-gray-400 focus:outline-none focus:border-[#56000c]"
                                autoFocus
                            />
                        </div>
                    )}

                    {/* Agent Options List */}
                    <div className="max-h-56 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
                        {/* Unassigned / Clear Option */}
                        <button
                            type="button"
                            onClick={() => handleSelect('Unassigned')}
                            className={`w-full px-3 py-2 text-xs font-semibold rounded-xl flex items-center justify-between text-left transition-colors cursor-pointer ${
                                value === 'Unassigned' || !value
                                    ? 'bg-[#FFE5E7] text-[#56000c]'
                                    : 'text-gray-500 hover:bg-gray-50'
                            }`}
                        >
                            <span className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-gray-300"></span>
                                Select Agent...
                            </span>
                            {(value === 'Unassigned' || !value) && <FiCheck size={14} className="text-[#56000c]" />}
                        </button>

                        {filteredAgents.length > 0 ? (
                            filteredAgents.map((agent) => {
                                const isSelected = value === agent._id;
                                return (
                                    <button
                                        key={agent._id}
                                        type="button"
                                        onClick={() => handleSelect(agent._id)}
                                        className={`w-full px-3 py-2 rounded-xl flex items-center justify-between gap-3 text-left transition-all cursor-pointer ${
                                            isSelected
                                                ? 'bg-[#56000c] text-white shadow-sm'
                                                : 'hover:bg-[#FFE5E7]/40 text-[#242424]'
                                        }`}
                                    >
                                        <div className="flex items-center gap-2.5 truncate">
                                            {agent.profile ? (
                                                <img
                                                    src={agent.profile}
                                                    alt={agent.fullName}
                                                    className="w-7 h-7 rounded-full object-cover border border-[#FFD2D6] shrink-0"
                                                    onError={(e) => {
                                                        (e.target as HTMLImageElement).style.display = 'none';
                                                    }}
                                                />
                                            ) : (
                                                <div
                                                    className={`w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center shrink-0 ${
                                                        isSelected
                                                            ? 'bg-white text-[#56000c]'
                                                            : 'bg-[#56000c] text-white'
                                                    }`}
                                                >
                                                    {agent.fullName?.charAt(0).toUpperCase()}
                                                </div>
                                            )}
                                            <div className="truncate">
                                                <p className={`text-xs font-bold truncate m-0 ${isSelected ? 'text-white' : 'text-[#242424]'}`}>
                                                    {agent.fullName}
                                                </p>
                                                {agent.email && (
                                                    <p className={`text-[10px] truncate m-0 ${isSelected ? 'text-white/80' : 'text-gray-400'}`}>
                                                        {agent.email}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        {isSelected && <FiCheck size={14} className="text-white shrink-0" />}
                                    </button>
                                );
                            })
                        ) : (
                            <div className="py-3 text-center text-xs text-gray-400">
                                No agents found
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default AgentSelect;
