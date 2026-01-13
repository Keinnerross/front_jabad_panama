import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "./components/layout/header";
import { Footer } from "./components/layout/footer";
import { TopBar } from "./components/layout/topBar";
import { NotificationContainer } from "./components/ui/notifications/NotificationContainer";
import { ClientProvidersWrapper } from "./components/providers/NotificationWrapper";
import { api } from "./services/strapiApiFetch";
import { getAvailableEvents } from "./utils/eventAvailability";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});




export async function generateMetadata() {
  let siteConfig = {};

  try {
    // console.log('🔍 Metadata: Fetching site config for SEO...');
    siteConfig = await api.siteConfig();
    // console.log('✅ Metadata: Site config fetched for SEO:', {
    //   title: siteConfig?.site_title,
    //   description: siteConfig?.site_description
    // });
  } catch (error) {
    console.error('❌ Metadata: Error fetching site config for SEO:', error);
  }


  return {
    title: {
      default: siteConfig?.site_title || "Chabbat Boquete, Panamá",
    },
    description: siteConfig?.site_description || "Welcome to your Jewish home in the mountains",
    icons: {
      icon: `${process.env.NEXT_PUBLIC_STRAPI_API_URL}${siteConfig?.logo?.url || "/favicon.ico"}`,
      shortcut: `${process.env.NEXT_PUBLIC_STRAPI_API_URL}${siteConfig?.logo?.url || "/favicon.ico"}`,
      apple: `${process.env.NEXT_PUBLIC_STRAPI_API_URL}${siteConfig?.logo?.url || "/favicon.ico"}`,
    },
  };
}

export default async function RootLayout({ children }) {
  let siteConfig = {};
  let customEvents = [];
  let platformSettings = {};
  let customPagesData = [];

  try {
    // console.log('🔍 Layout: Fetching all data in parallel...');

    // Hacer todas las llamadas en paralelo para mejor performance
    const [siteConfigData, platformSettingsData, allEvents, customPagesResult] = await Promise.all([
      api.siteConfig(),
      api.platformSettings(),
      api.shabbatsAndHolidays(),
      api.customPages()
    ]);

    siteConfig = siteConfigData || {};
    platformSettings = platformSettingsData || { habilitar_packages: true };
    customEvents = getAvailableEvents(allEvents || []);
    customPagesData = customPagesResult || [];

    // console.log('✅ Layout: All data fetched successfully');
    // console.log('✅ Layout: Available custom events:', customEvents.length);
  } catch (error) {
    console.error('❌ Layout: Error fetching layout data:', error);
    platformSettings = { habilitar_packages: true }; // Default to true if error
  }

  return (
    <html lang="en" data-theme={siteConfig?.color_theme || 'blue'}>
      <body className={`${inter.variable} font-sans antialiased`}>
        <ClientProvidersWrapper>
          <TopBar 
            platformSettings={platformSettings}
          />
          <Header 
            data={siteConfig} 
            customPagesData={customPagesData}
            customEventsData={customEvents}
            platformSettings={platformSettings}
          />
          {children}
          <Footer activitiesData={[]} platformSettings={platformSettings} />
          <NotificationContainer />
        </ClientProvidersWrapper>
      </body>
    </html>
  );
}