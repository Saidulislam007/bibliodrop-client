import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";

const client = new MongoClient(process.env.MONGO_URI);
const db = client.db("bibliodrop");

export const auth = betterAuth({
  database: mongodbAdapter(db, {
    client
  }),
  
  emailAndPassword: { 
    enabled: true, 
  },
  
  // 🛡️ রোল (role) ফিল্ড ফিক্স: অতিরিক্ত ফিল্ডের প্রপার ম্যাপিং
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "user" // কোনো রোল না পাঠালে ডিফল্ট 'user' হিসেবে সেভ হবে
      }
    }
  },

  socialProviders: {
    google: { 
      clientId: process.env.GOOGLE_CLIENT_ID, 
      clientSecret: process.env.GOOGLE_CLIENT_SECRET, 
    }, 
  },

  // 🌐 ৪MD৩ ফরবিডেন এরর দূর করার মহৌষধ (Trusted Origins)
  // এটি Vercel এবং লোকালহোস্ট উভয় জায়গার রিকোয়েস্টকে ট্রাস্ট করতে বাধ্য করবে ভাই
  trustedOrigins: [
    "http://localhost:3000",
    "https://bibliodrop-client-eight.vercel.app"
  ],

  // ⚡ Vercel-এর রিভার্স প্রক্সি এবং সিকিউর কুকি হ্যান্ডলিং এনাবল করা হলো
  advanced: {
    useSecureCookies: true,
  }
});