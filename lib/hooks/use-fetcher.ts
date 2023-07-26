"use client";

import useSWR from "swr";
import { useToast } from "@/components/ui/use-toast";
import { signOut } from "next-auth/react";

export function useFetcher() {
  const { toast } = useToast();

  async function fetcher(
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
      const resBody = await res.text();
      const pathName = new URL(res.url).pathname;

      toast({
        variant: "destructive",
        title: `Api: ${pathName}`,
        description: `${res.status}: ${resBody}`,
      });
    }

    if (res.status === 401) {
      signOut();
      window.localStorage.clear();
      return null;
    }

    const json = await res.json();
    return json?.data || json;
  }

  return fetcher;
}
