"use client";

export async function fetchClient(url: string, params?: Record<string, any>) {
  const token = localStorage.getItem("token");
  if (!token) {
    return;
  }

  const options = {
    ...params,
    headers: {
      Authorization: JSON.parse(token) || "",
    },
  };

  const res = await fetch(url, options);
  return res;
}
