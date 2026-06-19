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
  
  // 🛡️ চূড়ান্ত ফিক্স: Better-Auth কে বাধ্য করা হচ্ছে যাতে সে রেজিস্ট্রেশনের সময় role ফিল্ডটিকে অ্যাক্সেপ্ট করে
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "user" // কোনো রোল না পাঠালে ডিফল্ট reader হিসেবে সেভ হবে
      }
    }
  },

  socialProviders: {
    google: { 
      clientId: process.env.GOOGLE_CLIENT_ID, 
      clientSecret: process.env.GOOGLE_CLIENT_SECRET, 
    }, 
  }
});