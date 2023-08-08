/* eslint-disable no-undef */
"use client";

import { signOut } from "next-auth/react";

export default async function fetcher(
  input: URL | RequestInfo,
  init?: RequestInit | undefined,
) {
  const token = localStorage.getItem("token");
  if (!token) {
    signOut();
    return null;
  }

  const newInit = {
    ...init,
    headers: {
      ...init?.headers,
      Authorization: token,
    },
  };
  const res = await fetch(input, newInit);

  if (!res.ok) {
    const error = new Error(
      "An error occurred while fetching the data.",
    ) as any;

    if (res.status === 401) {
      signOut();
      window.localStorage.clear();
      return null;
    }

    if (res.status === 422) {
      error.info = "params error, sign failed";
    }

    if (!error.info) {
      const resBody = await res.text();
      const errorTip =
        resBody.length > 100 ? "Failed: An error occurred" : resBody;
      error.info = errorTip;
    }

    error.status = res.status;

    throw error;
  }

  const json = await res.json();
  return json?.data || json;
}