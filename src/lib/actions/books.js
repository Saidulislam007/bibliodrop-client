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

