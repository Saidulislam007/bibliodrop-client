import CoreFeatures from "@/components/CoreFeatures";
import HeroBanner from "@/components/HeroBanner";
import PlatformLiveStats from "@/components/PlatformLiveStats";
import ValueProposition from "@/components/ValueProposition";

export default function Home() {
  return (
    <div className="w-full min-h-screen bg-white text-slate-900 font-sans block relative">
      
      {/* 🟢 পিওর ফিক্স: ব্যানারের হাইটের সাথে ম্যাচ করে প্যারেন্ট ডিভে রেসপনসিভ হাইট লক করে দেওয়া হলো */}
      <div className="relative z-10 w-full h-[580px] sm:h-[640px] lg:h-[680px] block">
        <HeroBanner />
      </div>
      
      <CoreFeatures />
      <PlatformLiveStats />
      <ValueProposition />
      
    </div>
  );
}