import { FiSend } from 'react-icons/fi';

export const EmptyChatState = () => {
    return (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-white rounded-2xl border border-[#FFD2D6]/40 shadow-[0_4px_20px_rgba(86,0,12,0.03)]">
            <div className="w-16 h-16 rounded-full bg-[#FFEAEA] border border-[#FFD2D6]/20 flex items-center justify-center mb-4 text-[#56000c]">
                <FiSend size={28} />
            </div>
            <h3 className="font-semibold text-lg text-[#242424]">No Conversation Selected</h3>
            <p className="text-sm text-[#242424B2] max-w-sm mt-1">
                Choose a user ticket from the list on the left to review message history and respond.
            </p>
        </div>
    );
};

export default EmptyChatState;
