import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "./components/layout/header";
import { Footer } from "./components/layout/footer";
import { NotificationContainer } from "./components/ui/notifications/NotificationContainer";
import { NotificationDemo } from "./components/ui/notifications/NotificationDemo";
import { AppWrapper } from "./components/providers/AppProviders";
import { api } from "./services/strapiApiFetch";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  // Opcional: puedes definir pesos específicos que necesites
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});


const urlApi = process.env.NEXT_PUBLIC_STRAPI_API_URL || 'http://localhost:1337';



//Llamada a la Api
const siteConfig = await api.siteConfig();


export const metadata = {
  title: {
    default: siteConfig.site_title || "Site Title",
  },
  description: siteConfig.site_description || "Site description",
  icons: {
    icon: `${urlApi}${siteConfig?.logo?.url}` || "/assets/global/asset001.png",
    shortcut: `${urlApi}${siteConfig?.logo?.url}` || "/assets/global/asset001.png",
    apple: `${urlApi}${siteConfig?.logo?.url}` || "/assets/global/asset001.png"
  },
};


export default async function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        <AppWrapper siteConfig={siteConfig}>
          <Header data={siteConfig} />
          {children}
          <Footer siteConfig={siteConfig} />
          <NotificationContainer />
        </AppWrapper>
      </body>
    </html>
  );
}