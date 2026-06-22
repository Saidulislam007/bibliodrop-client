const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

export const createBooks = async (newBooksData) => {
  try {
    const res = await fetch(`${baseUrl}/books`, {
      method: 'POST', // Obosshoi capital letter-e 'POST' likhte hobe
      headers: {
        'Content-Type': 'application/json' // Server ke bolchhi eta JSON data
      },
      body: JSON.stringify(newBooksData) // Object ke string-e convert korlam
    });
    return await res.json();
  } catch (error) {
    console.error("Fetch Error in Action:", error);
    return { success: false, message: error.message };
  }
};


export const updateBookStatus = async (id, updateData) => {
  try {
    const res = await fetch(`${baseUrl}/books/${id}`, {
      method: 'PATCH', // মঙ্গোডিবির নির্দিষ্ট ফিল্ড পারশিয়াল আপডেট করার জন্য PATCH বেস্ট
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updateData)
    });
    return await res.json();
  } catch (error) {
    console.error("Fetch Error in updateBookStatus Action:", error);
    return { success: false, message: error.message };
  }
};

export const deleteBook = async (id) => {
  try {
    const res = await fetch(`${baseUrl}/books/${id}`, {
      method: 'DELETE', // ডাটা ডিলিট করার জন্য স্ট্যান্ডার্ড DELETE মেথড
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return await res.json();
  } catch (error) {
    console.error("Fetch Error in deleteBook Action:", error);
    return { success: false, message: error.message };
  }
};


export const addToWishlist = async (wishlistData) => {
  try {
    const res = await fetch(`${baseUrl}/wishlist`, {
      method: 'POST', // ডাটাবেজে নতুন ডকুমেন্ট তৈরি বা ক্রিয়েট করার জন্য POST মেথড পারফেক্ট
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(wishlistData)
    });
    return await res.json();
  } catch (error) {
    console.error("Fetch Error in addToWishlist Action:", error);
    return { success: false, message: error.message };
  }
};

export const deleteWishlistItem = async (id) => {
  try {
    const res = await fetch(`${baseUrl}/wishlist/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return await res.json();
  } catch (error) {
    console.error("Fetch Error in deleteWishlistItem Action:", error);
    return { success: false, message: error.message };
  }
};


export const requestBookDelivery = async (deliveryData) => {
  try {
    const res = await fetch(`${baseUrl}/deliveries`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(deliveryData)
    });
    return await res.json();
  } catch (error) {
    console.error("Fetch Error in requestBookDelivery Action:", error);
    return { success: false, message: error.message };
  }
};

export const updateDeliveryStatus = async (id, statusData) => {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5000";
    const res = await fetch(`${baseUrl}/deliveries/${id}`, {
      method: 'PATCH', // নির্দিষ্ট ফিল্ড পারশিয়াল আপডেট করার জন্য PATCH মেথড বেস্ট
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(statusData)
    });
    return await res.json();
  } catch (error) {
    console.error("Fetch Error in updateDeliveryStatus Action:", error);
    return { success: false, message: error.message };
  }
};


export const createBookReview = async (reviewData) => {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5000";
    
    // 🚀 আপনার এক্সপ্রেস ব্যাকএন্ডের /reviews এন্ডপয়েন্টে হিট করা হচ্ছে ভাই
    const res = await fetch(`${baseUrl}/reviews`, {
      method: 'POST', // নতুন ডেটা ডাটাবেজে তৈরি করার জন্য POST মেথড ফিক্সড ভাই
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(reviewData) // ফ্রন্টএন্ড থেকে পাঠানো অবজেক্টটি স্ট্রিংফাই করা হলো
    });

    return await res.json();
  } catch (error) {
    console.error("Fetch Error in createBookReview Action:", error);
    return { success: false, message: error.message };
  }
};
