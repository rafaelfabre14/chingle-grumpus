import type { Metadata } from "next";
import { Bebas_Neue, Bangers, Nunito_Sans } from "next/font/google";
import "./globals.css";
import AnnouncementTicker from "@/components/layout/AnnouncementTicker";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { CartProvider } from "@/lib/cart";

const bebasNeue = Bebas_Neue({
  weight: "400",
  variable: "--font-bebas",
  subsets: ["latin"],
});

const bangers = Bangers({
  weight: "400",
  variable: "--font-bangers",
  subsets: ["latin"],
});

const nunitoSans = Nunito_Sans({
  weight: ["400", "600", "700"],
  variable: "--font-nunito",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Chingle Grumpus — Pokemon Cards",
  description:
    "Pokemon singles, sealed product & graded slabs — straight from Chingle Grumpus. Shop now or catch the next live drop on Whatnot.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${bebasNeue.variable} ${bangers.variable} ${nunitoSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col" style={{ fontFamily: "var(--font-nunito), sans-serif" }}>
        <CartProvider>
          <div className="sticky top-0 z-50">
            <AnnouncementTicker />
            <Navbar />
          </div>
          <main className="flex-1">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
