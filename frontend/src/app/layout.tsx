import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Providers from "@/components/Providers";

// const inter = Inter({ subsets: ["latin"] });
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "FasoHoops.BF — Plateforme Nationale de Recrutement Basketball",
  description:
    "FasoHoops.BF connecte les joueurs, clubs, entraîneurs et agents du basketball burkinabè. Découvrez les talents, postulez aux offres et gérez votre carrière.",
  keywords: ["basketball", "Burkina Faso", "recrutement", "FEBBA", "FasoHoops"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={inter.variable}>
      <body className="min-h-screen flex flex-col bg-background text-foreground antialiased">
        <Providers>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
