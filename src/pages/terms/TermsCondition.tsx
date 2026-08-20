import PageHeader from '../../components/ui/PageHeader';
import { useGetSettingsQuery } from '../../features/Privacy/privacyApi';

const TermsCondition = () => {
    const { data: response, isLoading, isError } = useGetSettingsQuery({ key: 'termsOfService', value: 'termsOfService' });
    const settingsData = response?.data;
    const termsHtml = settingsData?.termsOfService || settingsData?.termsCondition || settingsData?.termsAndConditions || settingsData?.terms || '';

    return (
        <div className="space-y-6 pb-6">
            <PageHeader
                title="Terms & Conditions"
                subtitle="Guidelines and rules for accessing and using the support panel."
            />

            <div className="bg-white rounded-2xl p-8 border border-[#FFD2D6]/40 shadow-[0_4px_20px_rgba(86,0,12,0.03)] text-[#242424] min-h-[300px]">
                {isLoading ? (
                    <div className="text-center py-12 text-gray-500 font-medium">
                        Loading Terms & Conditions...
                    </div>
                ) : isError ? (
                    <div className="text-center py-12 text-red-500 font-medium">
                        Failed to load Terms & Conditions. Please try again.
                    </div>
                ) : termsHtml ? (
                    <div 
                        className="prose max-w-none text-[#242424] leading-relaxed [&_h1]:text-xl [&_h1]:font-bold [&_h1]:text-[#56000c] [&_h2]:text-lg [&_h2]:font-bold [&_h2]:text-[#56000c] [&_h3]:text-base [&_h3]:font-bold [&_h3]:text-[#56000c] [&_p]:text-gray-700 [&_p]:leading-relaxed [&_p]:my-2"
                        dangerouslySetInnerHTML={{ __html: termsHtml }}
                    />
                ) : (
                    <div className="text-center py-12 text-gray-400 font-medium">
                        No Terms & Conditions content available.
                    </div>
                )}
            </div>
        </div>
    );
};

export default TermsCondition;
