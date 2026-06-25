// 🌐 গ্লোবাল লাইভ রেন্ডার সার্ভার ইউআরএল (একটি কমন জায়গায় ডিফাইন করা হলো)
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://bibliodrop-server-3.onrender.com';

// ==========================================
// 📚 BOOKS ACTIONS
// ==========================================
export const createBooks = async (newBooksData) => {
  try {
    const res = await fetch(`${baseUrl}/books`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newBooksData)
    });
    return await res.json();
  } catch (error) {
    console.error("Fetch Error in createBooks Action:", error);
    return { success: false, message: error.message };
  }
};

export const updateBookStatus = async (id, updateData) => {
  try {
    const res = await fetch(`${baseUrl}/books/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
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
    const res = await fetch(`${baseUrl}/books/${id}`, { // 🟢 /api/ স্লাইসটি বাদ দেওয়া হলো যদি রাউটে না থাকে
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' }
    });
    return await res.json();
  } catch (error) {
    console.error("Fetch Error in deleteBook Action:", error);
    return { success: false, message: error.message };
  }
};

// ==========================================
// 💖 WISHLIST ACTIONS
// ==========================================
export const addToWishlist = async (wishlistData) => {
  try {
    const res = await fetch(`${baseUrl}/wishlist`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
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
      headers: { 'Content-Type': 'application/json' }
    });
    return await res.json();
  } catch (error) {
    console.error("Fetch Error in deleteWishlistItem Action:", error);
    return { success: false, message: error.message };
  }
};

// ==========================================
// 📦 DELIVERY ACTIONS
// ==========================================
export const requestBookDelivery = async (deliveryData) => {
  try {
    const res = await fetch(`${baseUrl}/deliveries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
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
    // 🟢 ফিক্সড: লোকালহোস্ট রিমুভ করে গ্লোবাল baseUrl ব্যবহার করা হয়েছে ভাই
    const res = await fetch(`${baseUrl}/deliveries/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(statusData)
    });
    return await res.json();
  } catch (error) {
    console.error("Fetch Error in updateDeliveryStatus Action:", error);
    return { success: false, message: error.message };
  }
};

// ==========================================
// ✍️ REVIEWS ACTIONS
// ==========================================
export const createBookReview = async (reviewData) => {
  try {
    // 🟢 ফিক্সড: লোকালহোস্ট রিমুভ করে গ্লোবাল baseUrl ব্যবহার করা হয়েছে ভাই
    const res = await fetch(`${baseUrl}/reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reviewData)
    });
    return await res.json();
  } catch (error) {
    console.error("Fetch Error in createBookReview Action:", error);
    return { success: false, message: error.message };
  }
};

export const updateBookReview = async (reviewId, updatedData) => {
  try {
    // 🟢 ফিক্সড: লোকালহোস্ট এবং ভুল ভ্যারিয়েবল রিমুভ করে গ্লোবাল baseUrl সেট করা হলো ভাই
    const response = await fetch(`${baseUrl}/reviews/${reviewId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedData),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message || "Failed to update review payload via cloud."
      };
    }

    return {
      success: true,
      modifiedCount: data.modifiedCount,
      message: data.message
    };

  } catch (error) {
    console.error("Client Action Error in updateBookReview:", error);
    return {
      success: false,
      message: "Network core handshake failure: " + error.message
    };
  }
};

export const deleteBookReview = async (reviewId) => {
  try {
    // 🟢 Better-Auth এর কুকি পাস করার জন্য credentials: 'include' যুক্ত রাখা হলো ভাই
    const res = await fetch(`${baseUrl}/reviews/${reviewId}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include' 
    });

    if (!res.ok) {
      throw new Error(`Server responded with status: ${res.status}`);
    }

    return await res.json();
  } catch (error) {
    console.error("Client Action Error in deleteBookReview:", error);
    return { success: false, message: error.message };
  }
};