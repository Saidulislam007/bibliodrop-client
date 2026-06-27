// 🌐 আপনার লাইভ রেন্ডার সার্ভার ইউআরএলটি ফলব্যাক (Fallback) হিসেবে সেট করা হলো
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://bibliodrop-server-3.onrender.com';

// 🔑 লোকাল স্টোরেজ থেকে সেফলি টোকেন গেট করার হেল্পার ফাংশন
const getAuthToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem("token");
  }
  return null;
};

// ==========================================
// 📚 ১. GET ALL BOOKS
// ==========================================
export const getBooks = async (page = 1, limit = 9999) => { // 👈 ডিফল্ট পেজ 1 এবং লিমিট বাড়িয়ে 9999 করা হলো
  try {
    const res = await fetch(`${baseUrl}/books?page=${page}&limit=${limit}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store'
    });
    
    if (!res.ok) {
      throw new Error(`Server status: ${res.status}`);
    }

    const data = await res.json();
    console.log("Fetched Books Data:", data);
    return data;
  } catch (error) {
    console.error("Fetch Error in getBooks API:", error);
    return { books: [], totalPages: 1 };
  }
};

// ==========================================
// 💖 ২. GET WISHLIST BY EMAIL (SECURED)
// ==========================================
// 📦 GET DELIVERIES BY EMAIL
export const getDeliveriesByEmail = async (email) => {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://bibliodrop-server-3.onrender.com';
    
    const res = await fetch(`${baseUrl}/deliveries?email=${email}`, {
      method: 'GET',
      headers: { 
        'Content-Type': 'application/json',
        // 🔑 ব্যাকএন্ডকে জানানোর জন্য সিক্রেট একটা হেডার বা টোকেন পাস করতে পারেন যদি ম্যানুয়াল ভেরিফাই করতে চান
        'X-User-Email': email 
      },
      credentials: 'include', 
      cache: 'no-store' 
    });
    
    if (!res.ok) {
      throw new Error(`Status: ${res.status}`);
    }
    
    return await res.json();
  } catch (error) {
    console.error("Fetch Error:", error);
    return [];
  }
};

// 💖 GET WISHLIST BY EMAIL
export const getWishlistByEmail = async (email) => {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://bibliodrop-server-3.onrender.com';

    const res = await fetch(`${baseUrl}/wishlist?email=${email}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include', // 👈 এখানেও কুকি পাস করা হলো
      cache: 'no-store' 
    });

    if (!res.ok) {
      console.error(`Wishlist Server status: ${res.status}`);
      return [];
    }

    return await res.json();
  } catch (error) {
    console.error("Fetch Error in getWishlistByEmail Action:", error);
    return [];
  }
};

// ==========================================
// ✍️ ৪. GET ALL REVIEWS
// ==========================================
export const getAllReviews = async () => {
  try {
    const res = await fetch(`${baseUrl}/reviews`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store'
    });
    
    if (!res.ok) {
      throw new Error(`Server status: ${res.status}`);
    }
    
    return await res.json();
  } catch (error) {
    console.error("Fetch Error in getAllReviews Action:", error);
    return [];
  }
};