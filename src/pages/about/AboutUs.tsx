import PageHeader from '../../components/ui/PageHeader';
import { useGetSettingsQuery } from '../../features/privacy/privacyApi';

const AboutUs = () => {
    const { data: response, isLoading, isError } = useGetSettingsQuery({ key: 'aboutUs', value: 'aboutUs' });
    const settingsData = response?.data;
    const aboutHtml = settingsData?.aboutUs || settingsData?.about || '';

    return (
        <div className="space-y-6 pb-6">
            <PageHeader
                title="About Us"
                subtitle="Information about the platform and support goals."
            />

            <div className="bg-white rounded-2xl p-8 border border-[#FFD2D6]/40 shadow-[0_4px_20px_rgba(86,0,12,0.03)] text-[#242424] min-h-[300px]">
                {isLoading ? (
                    <div className="text-center py-12 text-gray-500 font-medium">
                        Loading About Us...
                    </div>
                ) : isError ? (
                    <div className="text-center py-12 text-red-500 font-medium">
                        Failed to load About Us. Please try again.
                    </div>
                ) : aboutHtml ? (
                    <div 
                        className="prose max-w-none text-[#242424] leading-relaxed [&_h1]:text-xl [&_h1]:font-bold [&_h1]:text-[#56000c] [&_h2]:text-lg [&_h2]:font-bold [&_h2]:text-[#56000c] [&_h3]:text-base [&_h3]:font-bold [&_h3]:text-[#56000c] [&_p]:text-gray-700 [&_p]:leading-relaxed [&_p]:my-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:my-2"
                        dangerouslySetInnerHTML={{ __html: aboutHtml }}
                    />
                ) : (
                    <div className="text-center py-12 text-gray-400 font-medium">
                        No About Us content available.
                    </div>
                )}
            </div>
        </div>
    );
};

export default AboutUs;
