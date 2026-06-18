import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "BiblioDrop",
  description: "Modern Book Delivery Marketplace",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased light`}
      style={{ colorScheme: "light" }}
    >
      {/* 🛠️ ফিক্স: বডিতে স্পষ্টভাবে bg-white locked করা হয়েছে */}
      <body className="min-h-full flex flex-col bg-white text-slate-900 m-0 p-0">
        
        {/* নেভবার মডিউল */}
        <Navbar />
        
        {/* 🛠️ ফিক্স: মেইন কন্টেইনারে bg-white এবং min-h নিশ্চিত করা হয়েছে 
            যাতে কন্টেন্ট কম থাকলেও পুরো স্ক্রিন সাদা থাকে */}
        <main className="flex-1 flex flex-col bg-white w-full">
          {children}
        </main>

        <Footer />

      </body>
    </html>
  );
}