const baseURL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5000"; // আপনার ব্যাকএন্ড বেস ইউআরএল দিন


export const getAllTicketsForAdmin = async () => {
  try {
    const res = await fetch(`${baseURL}/admin/all-tickets`, {
      cache: "no-store", // ক্যাশ বাইপাস করার জন্য যাতে সবসময় রিয়েল-টাইম ডাটা পাওয়া যায়
    });

    if (!res.ok) {
      throw new Error("Failed to fetch admin tickets");
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching admin tickets:", error);
    return [];
  }
};
