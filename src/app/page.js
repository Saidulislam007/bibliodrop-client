import CoreFeatures from "@/components/CoreFeatures";
import HeroBanner from "@/components/HeroBanner";
import PlatformLiveStats from "@/components/PlatformLiveStats";
import ValueProposition from "@/components/ValueProposition";



export default function Home() {
  return (
    // min-h-screen নিশ্চিত করবে যে ব্যাকগ্রাউন্ডটি পুরো স্ক্রিন জুড়ে সাদা থাকবে
    <div className="flex flex-col min-h-screen w-full items-center justify-center bg-white text-slate-900 font-sans">
      
      <HeroBanner />
      <CoreFeatures />
      <PlatformLiveStats />
      <ValueProposition />
      
      
    </div>
  );
}