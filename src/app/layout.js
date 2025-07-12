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

export const metadata = {
  title: {
    default: "Chabbat Template",
  },

};





export default async function RootLayout({ children }) {

  const siteConfig = await api.siteConfig();









  
  return (
    <html lang="en">

      <body className={`${inter.variable} font-sans antialiased`}>
        <AppWrapper siteConfig={siteConfig}>
          <Header data={siteConfig}/>
          {children}
          <Footer />
          <NotificationContainer />
        </AppWrapper>
      </body>
    </html>
  );
}