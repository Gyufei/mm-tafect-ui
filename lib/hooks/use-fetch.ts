"use client";

import { signOut, useSession } from "next-auth/react";
import { useToast } from "@/components/ui/use-toast";
import { useCallback, useEffect, useMemo, useState } from "react";
import useLocalStorage from "./use-local-storage";

export function useFetch(url: string, params?: any | undefined) {
  const { toast } = useToast();
  const { data: session } = useSession();
  const [response, setResponse] = useState<any>();
  const [token, setToken] = useLocalStorage("token", session?.user?.image);

  const fetcher = async () => {
    const headers = {
      Authorization: `${token || ""}`,
    };

    const options = {
      ...params,
      headers,
    };

    const res = await fetch(url, options);
    if (!token) {
      return null;
    }

    if (token && res.status === 401) {
      // signOut();
      console.log("123", token);
      return null;
    }
    const json = await res.json();

    setResponse(json);
  };

  useEffect(() => {
    if (!session?.user?.image) {
      return;
    }

    if (session?.user?.image !== token) {
      setToken(session.user.image);
    }

    if (token) {
      fetcher();
    }
  }, [session?.user?.image]);

  return {
    data: response,
  };
}
