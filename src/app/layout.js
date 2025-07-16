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




export const metadata = {
  title: {
    default: "Chabbat Boquete, Panamá",
  },
  description: "Welcome to your Jewish home in the mountains",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico"
  },
};

export default async function RootLayout({ children }) {
  const siteConfig = await api.siteConfig();
  
  return (
    <html lang="en" data-theme={siteConfig?.color_theme || 'blue'}>
      <body className={`${inter.variable} font-sans antialiased`}>
        <ClientProvidersWrapper>
          <Header data={siteConfig} />
          {children}
          <Footer />
          <NotificationContainer />
        </ClientProvidersWrapper>
      </body>
    </html>
  );
}