import { LegalPageContent } from '@/app/components/sections/LegalContent/LegalPageContent';
import { api } from '@/app/services/strapiApiFetch';

export const metadata = {
  title: 'Privacy Policy | Jabad Panama',
  description: 'Privacy policy for Jabad Panama services',
};

export default async function PrivacyPolicy() {
  const data = await api.privacyPolicy();
  const privacyData = data?.privacy_policy;

  return (
    <LegalPageContent 
      title={privacyData?.title || "Privacy Policy"}
      description={privacyData?.description}
    />
  );
}