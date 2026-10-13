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




export const getAllProducts = async (search) => {
  const res = await fetch(`${baseURl}/products?search=${search}`);
  const data = await res.json();

  return data;
};




export const getProductById = async (id) => {
  const res = await fetch(`${baseURl}/product/${id}`);
  const data = await res.json();
  return data;
};
