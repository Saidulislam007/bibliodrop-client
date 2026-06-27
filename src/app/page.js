
import CoreFeatures from "@/components/CoreFeatures";
import FeaturedBooks from "@/components/FeaturedBooks";
import FeaturedLibrarians from "@/components/FeaturedLibrarians";
import HeroBanner from "@/components/HeroBanner";
import PopularCategories from "@/components/PopularCategories";
import StatsSection from "@/components/StatsSection";
import Testimonials from "@/components/Testimonials";
import ValueProposition from "@/components/ValueProposition";

export default function Home() {
  return (
    <div className="w-full min-h-screen bg-white text-slate-900 font-sans block relative">
      
      {/* 🟢 পিওর ফিক্স: ব্যানারের হাইটের সাথে ম্যাচ করে প্যারেন্ট ডিভে রেসপনসিভ হাইট লক করে দেওয়া হলো */}
      <div className="relative m- z-10 w-full h-[80px] sm:h-[640px] lg:h-[780px] block">
        <HeroBanner />
      </div>
      <FeaturedBooks />
      <CoreFeatures />
      <StatsSection />
      <PopularCategories />
      <FeaturedLibrarians />
      <Testimonials />
      <ValueProposition />
      
    </div>
  );
}