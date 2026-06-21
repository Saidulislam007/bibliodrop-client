const baseUrl = process.env.NEXT_PUBLIC_BASE_URL; 

/**
 * 🔄 Fetch users from backend with optional email or role filtering
 */
export const getUsers = async (email = "", role = "") => {
  try {
    const response = await fetch(`${baseUrl}/users?email=${email}&role=${role}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    // মঙ্গোডিবি ড্রাইভারে সাকসেস বা ফেক হাইড্রেশন এরর এড়াতে প্রপার জেসন পার্সিং
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Fetch Error in getUsers Client Action:", error);
    return []; // কোনো এরর হলে ক্র্যাশ না করে সেফলি খালি অ্যারে রিটার্ন করবে
  }
};


export const deleteUser = async (id) => {
  try {
    const response = await fetch(`${baseUrl}/users/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Fetch Error in deleteUser Action:", error);
    return { success: false, message: error.message };
  }
};