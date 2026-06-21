const baseUrl = process.env.NEXT_PUBLIC_BASE_URL; 


export const getBooks = async (category, author) => {
  const response = await fetch(`${baseUrl}/books?category=${category}&author=${author}`);
  const data = await response.json();
  return data;
};

export const getWishlistByEmail = async (email) => {
  try {
    // এখানে আপনার baseUrl এবং কোয়েরি প্যারামিটার হিসেবে ইমেইল পাস হচ্ছে
    const res = await fetch(`${baseUrl}/wishlist?email=${email}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      cache: 'no-store' // ফ্রেশ ডাটা ইনস্ট্যান্ট লোড করার জন্য
    });
    return await res.json();
  } catch (error) {
    console.error("Fetch Error in getWishlistByEmail Action:", error);
    return [];
  }
};

// lib/api/books.js

// 🔍 ইউজারের ইমেইল দিয়ে তার সমস্ত হোম ডেলিভারি রিকোয়েস্ট গেট (GET) করার ফেচ ফাংশন
export const getDeliveriesByEmail = async (email) => {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5000"; // আপনার এক্সপ্রেস সার্ভার ইউআরএল
    
    const res = await fetch(`${baseUrl}/deliveries?email=${email}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      cache: 'no-store' // রিয়াল-টাইম বা ফ্রেশ আপডেট ডাটা ইনস্ট্যান্ট লোড করার জন্য ভাই
    });
    
    return await res.json();
  } catch (error) {
    console.error("Fetch Error in getDeliveriesByEmail API:", error);
    return [];
  }
};