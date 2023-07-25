"use client";

import useSWR from "swr";
import { signOut, useSession } from "next-auth/react";
import { useCallback, useEffect, useMemo, useState } from "react";

import { useToast } from "@/components/ui/use-toast";
import useLocalStorage from "./use-local-storage";
import { fetchClient } from "../fetchClient";

export function useFetch(url: string, params?: any | undefined) {
  const { toast } = useToast();
  const { data: session } = useSession();
  const [token, setToken] = useLocalStorage("token", session?.user?.image);

  const fetcher = async () => {
    if (!token) {
      return null;
    }

    const res = await fetchClient(url, params);

    if (!res?.ok) {
      toast({
        variant: "destructive",
        title: "Api Error",
        description: `${res?.status}: Something went wrong`,
      });
    }

    if (token && res?.status === 401) {
      signOut();
      window.localStorage.clear();
      return null;
    }

    const json = await res?.json();

    return json?.data || json;
  };

  const result = useSWR(url, fetcher);

  useEffect(() => {
    if (!session?.user?.image) {
      return;
    }

    if (session?.user?.image !== token) {
      setToken(session.user.image);
    }

    if (token) {
      result.mutate();
    }
  }, [session?.user?.image]);

  return result;
}
