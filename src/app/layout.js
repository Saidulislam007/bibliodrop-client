import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "BiblioDrop – Online Book Delivery",
  description: "Modern Book Delivery Marketplace",
};

export default function RootLayout({ children }) {
  return (
    // ফিক্স: html ট্যাগে explicitly 'light' ক্লাস এবং style কালার-স্কিম যোগ করা হয়েছে
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased light`}
      style={{ colorScheme: "light" }}
    >
      {/* ফিক্স: বডিতে bg-white এবং text-slate-900 দিয়ে লাইট থিম এনফোর্স করা হয়েছে */}
      <body className="min-h-full flex flex-col bg-white text-slate-900">
        <Navbar />
        <main className="flex-1 flex flex-col bg-white">
          {children}
        </main>
      </body>
    </html>
  );
}