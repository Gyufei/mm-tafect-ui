"use client";

import { createContext, useEffect, useMemo, useState } from "react";
import useSWR from "swr";

import fetcher from "@/lib/fetcher";
import { SystemEndPointPathMap, UserEndPointPathMap } from "../end-point";
import { cloneDeep } from "lodash";
import { redirect } from "next/navigation";

type PathMap = typeof UserEndPointPathMap;

interface IUserEndPointContext {
  userEndPoint: string | null;
  userPathMap: PathMap;
  refreshEndPoint: (arg: any) => void;
}

export const UserEndPointContext = createContext<IUserEndPointContext>({
  userEndPoint: null,
  refreshEndPoint: () => {},
  userPathMap: {} as PathMap,
});

export default function UserEndPointProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: userEndPointData, mutate: refreshEndPoint } = useSWR(
    SystemEndPointPathMap.endPoint,
    fetcher,
  );
  const userEndPoint = useMemo(
    () => userEndPointData?.end_point,
    [userEndPointData],
  );

  const [userPathMap, setPathMap] = useState({} as PathMap);

  useEffect(() => {
    if (userEndPointData && !userEndPoint) {
      redirect("/setting");
      return;
    }

    const newMap = cloneDeep(UserEndPointPathMap);
    const keys = Object.keys(newMap) as Array<keyof PathMap>;

    keys.map((key) => {
      newMap[key] = userEndPoint ? `${userEndPoint}${newMap[key]}` : "";
    });

    setPathMap(newMap);
  }, [userEndPoint]);

  return (
    <UserEndPointContext.Provider
      value={{
        userEndPoint,
        userPathMap,
        refreshEndPoint,
      }}
    >
      {children}
    </UserEndPointContext.Provider>
  );
}
