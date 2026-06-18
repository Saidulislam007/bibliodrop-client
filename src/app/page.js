import Image from "next/image";

export default function Home() {
  return (
    // min-h-screen নিশ্চিত করবে যে ব্যাকগ্রাউন্ডটি পুরো স্ক্রিন জুড়ে সাদা থাকবে
    <div className="flex flex-col min-h-screen w-full items-center justify-center bg-white text-slate-900 font-sans">
      
      {/* এখানে আপনার হোয়ার বা ল্যান্ডিং পেজের মেইন কন্টেন্ট বসবে */}
      <div className="text-center">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
          Welcome to <span className="text-indigo-600">BiblioDrop</span>
        </h1>
        <p className="mt-4 text-lg text-slate-500">
          Your favorite books, delivered right to your doorstep.
        </p>
      </div>

    </div>
  );
}