import { api } from "@/app/services/strapiApiFetch";
import DonationForm from "@/app/components/sections/Donation/DonationForm";

export default async function Donation() {
    const copiesData = await api.copiesPages();
    return <DonationForm copiesData={copiesData} />;
}
