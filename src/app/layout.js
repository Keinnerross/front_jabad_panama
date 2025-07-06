import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "./components/layout/header";
import { Footer } from "./components/layout/footer";
import { CartProvider } from "./context/CartContext";
import { NotificationProvider } from "./context/NotificationContext";
import { NotificationContainer } from "./components/ui/notifications/NotificationContainer";
import { NotificationDemo } from "./components/ui/notifications/NotificationDemo";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  // Opcional: puedes definir pesos específicos que necesites
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

export const metadata = {
  title: "Chabad Boquete",
  description: "Welcome Kosher Tourists to Boquete, Panama!",
  icons: {
    icon: '/icon.png',  // Tu archivo icon.png
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        <NotificationProvider>
          <CartProvider>
            <Header />
            {children}
            <Footer />
            <NotificationContainer />
           {/*  <NotificationDemo /> */}
          </CartProvider>
        </NotificationProvider>
      </body>
    </html>
  );
}