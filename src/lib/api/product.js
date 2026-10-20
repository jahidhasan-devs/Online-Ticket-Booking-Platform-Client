import { getTokenServer } from "../getTokenServer";

const baseURl = process.env.NEXT_PUBLIC_SERVER_URL;

export const getProduct = async (page) => {
  if (!page) {
    page = 1;
  }
  const token = await getTokenServer();
  const res = await fetch(`${baseURl}/seller/products?page=${page}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${token}`,
    },
  });
  const data = await res.json();
  return data;
};

export const getAllTicket = async (queryParams = {}) => {
  const {
    search = "",
    from = "",
    to = "",
    transportType = "",
    sort = "",
    status = "",
    page = 1,
    limit = 8,
  } = queryParams;

  const params = new URLSearchParams();

  if (search) params.append("search", search);
  if (from) params.append("from", from);
  if (to) params.append("to", to);
  if (transportType && transportType !== "all")
    params.append("transportType", transportType);
  if (sort) params.append("sort", sort);
  if (status) params.append("status", status); // Status পাঠালে ব্যাকএন্ড ফিল্টার করবে
  if (page) params.append("page", page);
  if (limit) params.append("limit", limit);

  const res = await fetch(`${baseURl}/products?${params.toString()}`, {
    cache: "no-store",
  });

  const data = await res.json();
  return data;
};



// export const getAllTicket = async (search) => {
//   const res = await fetch(`${baseURl}/products?search=${search}`);
//   const data = await res.json();

//   return data;
// };


export const getAdvertisedTickets = async () => {
  try {
    const res = await fetch(`${baseURl}/advertised-tickets`, {
      cache: "no-store",
    });

    if (!res.ok) return [];

    return await res.json();
  } catch (error) {
    console.error("Get advertised tickets error:", error);
    return [];
  }
};

export const getTicketById = async (id) => {
  const res = await fetch(`${baseURl}/product/${id}`);
  const data = await res.json();
  return data;
};
