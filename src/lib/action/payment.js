"use server";

const baseURl = process.env.NEXT_PUBLIC_SERVER_URL;

export const subscription = async (data) => {
  const res = await fetch(`${baseURl}/subscription`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const resData = await res.json();
  return resData;
};
