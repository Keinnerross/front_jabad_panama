import { LegalPageContent } from '@/app/components/sections/LegalContent/LegalPageContent';
import { api } from '@/app/services/strapiApiFetch';

export const metadata = {
  title: 'Terms & Conditions | Jabad Panama',
  description: 'Terms and conditions for using Jabad Panama services',
};

export default async function TermsConditions() {
  const data = await api.termsAndConditions();
  const termsData = data?.terms_and_conditions;

  return (
    <LegalPageContent 
      title={termsData?.title || "Terms & Conditions"}
      description={termsData?.description}
    />
  );
}