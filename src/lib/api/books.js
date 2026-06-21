const baseUrl = process.env.NEXT_PUBLIC_BASE_URL; 


export const getBooks = async (category, author) => {
  const response = await fetch(`${baseUrl}/books?category=${category}&author=${author}`);
  const data = await response.json();
  return data;
};