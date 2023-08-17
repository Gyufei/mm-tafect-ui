"use client";

import { toast } from "@/components/ui/use-toast";
import { SWRConfig } from "swr";

export default function SWRConfigProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SWRConfig
      value={{
        onError: (error, key) => {
          toast({
            variant: "destructive",
            title: `Api: ${key}`,
            description: `${error.status}: ${error.info}`,
          });
        },
      }}
    >
      {children}
    </SWRConfig>
  );
}
