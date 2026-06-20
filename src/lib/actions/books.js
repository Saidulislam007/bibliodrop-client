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