import React, { useState, useRef } from 'react';
import { FiSend, FiPaperclip, FiX } from 'react-icons/fi';
import { ChatWindowProps } from './chats.types';
import EmptyChatState from './EmptyChatState';
import { baseURL } from '../../utils/BaseURL';

const getImageUrl = (path: string | null | undefined) => {
    if (!path) return '';
    if (path.startsWith('http://') || path.startsWith('https://')) return path;
    const cleanPath = path.replace(/\\/g, '/');
    const cleanBase = (baseURL || '').endsWith('/') ? baseURL.slice(0, -1) : (baseURL || '');
    return `${cleanBase}/${cleanPath.startsWith('/') ? cleanPath.slice(1) : cleanPath}`;
};

export const ChatWindow = ({
    selectedChat,
    onStatusChange,
    onSendMessage,
    messagesEndRef,
    getAvatarBg,
    isLoadingMessages = false,
    isMarkingSolved = false,
}: ChatWindowProps) => {
    const [inputText, setInputText] = useState('');
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setSelectedImage(file);
            setImagePreviewUrl(URL.createObjectURL(file));
        }
    };

    const removeSelectedImage = () => {
        setSelectedImage(null);
        if (imagePreviewUrl) {
            URL.revokeObjectURL(imagePreviewUrl);
            setImagePreviewUrl(null);
        }
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputText.trim() && !selectedImage) return;
        onSendMessage(inputText.trim(), selectedImage);
        setInputText('');
        removeSelectedImage();
    };

    if (!selectedChat) {
        return <EmptyChatState />;
    }

    return (
        <div className="flex-1 flex flex-col bg-white rounded-2xl border border-[#FFD2D6]/40 shadow-[0_4px_20px_rgba(86,0,12,0.03)] overflow-hidden min-h-0">
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-100 bg-[#FFEAEA] flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white relative ${getAvatarBg(selectedChat.userName)}`}>
                        {selectedChat.userName ? selectedChat.userName.split(' ').map(n => n[0]).join('').toUpperCase() : 'U'}
                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-[#FFEAEA] rounded-full" />
                    </div>
                    <div>
                        <h3 className="font-bold text-sm text-[#242424] m-0">
                            {selectedChat.userName}
                        </h3>
                        {selectedChat.userEmail && (
                            <p className="text-xs text-gray-500 m-0">{selectedChat.userEmail}</p>
                        )}
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                    {!selectedChat.isSolved && selectedChat.status !== 'Resolved' && selectedChat.status !== 'Closed' ? (
                        <button
                            onClick={() => onStatusChange('Resolved')}
                            disabled={isMarkingSolved}
                            className="px-4 py-1.5 text-xs bg-[#56000c] hover:bg-[#7d1522] text-white font-bold rounded-lg transition cursor-pointer disabled:opacity-50"
                        >
                            {isMarkingSolved ? 'Marking...' : 'Mark as Solve'}
                        </button>
                    ) : (
                        <span className="px-4 py-1.5 text-xs bg-[#FFF0F2] text-[#56000c] font-bold rounded-lg border border-[#FFD2D6]/40 select-none">
                            Solved
                        </span>
                    )}
                </div>
            </div>

            {/* Messages Scroll Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar bg-white flex flex-col">
                {isLoadingMessages ? (
                    <div className="py-12 text-center text-gray-400 text-sm">Loading messages...</div>
                ) : selectedChat.messages.length === 0 ? (
                    <div className="py-12 text-center text-gray-400 text-sm">No messages in this chat yet. Start typing below!</div>
                ) : (
                    selectedChat.messages.map((msg) => {
                        const isAgent = msg.sender === 'agent';
                        return (
                            <div
                                key={msg.id}
                                className={`flex gap-3 items-end ${isAgent ? 'justify-end' : 'justify-start'}`}
                            >
                                {!isAgent && (
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white self-end mb-4 shrink-0 ${getAvatarBg(selectedChat.userName)}`}>
                                        {selectedChat.userName.charAt(0).toUpperCase()}
                                    </div>
                                )}
                                <div className="flex flex-col max-w-[70%]">
                                    <div className={`rounded-2xl px-4 py-2.5 shadow-[0_2px_8px_rgba(0,0,0,0.02)] ${
                                        isAgent 
                                            ? 'bg-[#56000c] text-white rounded-tr-none' 
                                            : 'bg-[#e9ecef] text-[#242424] rounded-tl-none'
                                    }`}>
                                        {msg.image && (
                                            <div className="mb-2 overflow-hidden rounded-lg">
                                                <img 
                                                    src={getImageUrl(msg.image)} 
                                                    alt="Attached" 
                                                    className="max-w-full max-h-48 object-cover rounded-lg"
                                                    onError={(e) => {
                                                        (e.target as HTMLImageElement).style.display = 'none';
                                                    }}
                                                />
                                            </div>
                                        )}
                                        {msg.text && <p className="text-sm leading-relaxed m-0 whitespace-pre-wrap">{msg.text}</p>}
                                    </div>
                                    <span className={`text-[9px] text-gray-400 mt-1 ${isAgent ? 'text-right' : 'text-left'}`}>
                                        {msg.time}
                                    </span>
                                </div>
                            </div>
                        );
                    })
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Input Footer Composer */}
            <form onSubmit={handleSubmit} className="p-4 border-t border-gray-100 bg-white">
                <input 
                    type="file" 
                    ref={fileInputRef} 
                    accept="image/*" 
                    className="hidden" 
                    onChange={handleFileChange} 
                />

                {/* Selected Image Preview */}
                {imagePreviewUrl && (
                    <div className="mb-2 relative inline-block">
                        <img 
                            src={imagePreviewUrl} 
                            alt="Selected Preview" 
                            className="w-20 h-20 object-cover rounded-xl border border-gray-200 shadow-sm"
                        />
                        <button
                            type="button"
                            onClick={removeSelectedImage}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow hover:bg-red-600 cursor-pointer"
                        >
                            <FiX size={12} />
                        </button>
                    </div>
                )}

                <div className="border border-gray-200 rounded-xl p-3 flex flex-col gap-2 bg-gray-50">
                    <textarea
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        placeholder="Type your message here..."
                        rows={3}
                        className="w-full bg-transparent text-sm text-[#242424] placeholder:text-gray-400 focus:outline-none resize-none"
                    />
                    <div className="flex justify-between items-center mt-2 border-t border-gray-100/50 pt-2">
                        {/* Attachment button */}
                        <button
                            type="button"
                            className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg transition hover:bg-gray-100 cursor-pointer"
                            onClick={() => fileInputRef.current?.click()}
                            title="Attach image"
                        >
                            <FiPaperclip size={18} />
                        </button>
                        {/* Send button */}
                        <button
                            type="submit"
                            disabled={!inputText.trim() && !selectedImage}
                            className="flex items-center gap-1.5 px-4 py-2 bg-[#56000c] hover:bg-[#7d1522] text-white rounded-lg text-xs font-bold transition disabled:opacity-40 cursor-pointer"
                        >
                            <span>Send</span>
                            <FiSend size={12} />
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default ChatWindow;
