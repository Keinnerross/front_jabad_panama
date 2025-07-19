import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "./components/layout/header";
import { Footer } from "./components/layout/footer";
import { NotificationContainer } from "./components/ui/notifications/NotificationContainer";
import { ClientProvidersWrapper } from "./components/providers/NotificationWrapper";
import { api } from "./services/strapiApiFetch";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  // Opcional: puedes definir pesos específicos que necesites
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});




export async function generateMetadata() {
  let siteConfig = {};
  
  try {
    console.log('🔍 Metadata: Fetching site config for SEO...');
    siteConfig = await api.siteConfig();
    console.log('✅ Metadata: Site config fetched for SEO:', { 
      title: siteConfig?.site_title, 
      description: siteConfig?.site_description 
    });
  } catch (error) {
    console.error('❌ Metadata: Error fetching site config for SEO:', error);
  }
  
  return {
    title: {
      default: siteConfig?.site_title || "Chabbat Boquete, Panamá",
    },
    description: siteConfig?.site_description || "Welcome to your Jewish home in the mountains",
    icons: {
      icon: "/favicon.ico",
      shortcut: "/favicon.ico",
      apple: "/favicon.ico"
    },
  };
}

export default async function RootLayout({ children }) {
  let siteConfig = {};
  
  try {
    console.log('🔍 Layout: Attempting to fetch site config...');
    siteConfig = await api.siteConfig();
    console.log('✅ Layout: Site config fetched successfully:', siteConfig);
  } catch (error) {
    console.error('❌ Layout: Error fetching site config:', error);
  }
  
  return (
    <html lang="en" data-theme={siteConfig?.color_theme || 'blue'}>
      <body className={`${inter.variable} font-sans antialiased`}>
        <ClientProvidersWrapper>
          <Header data={siteConfig} />
          {children}
          <Footer activitiesData={[]} />
          <NotificationContainer />
        </ClientProvidersWrapper>
      </body>
    </html>
  );
}