"use client";

import { createContext, useEffect, useMemo, useState } from "react";
import useSWR from "swr";

import fetcher from "@/lib/fetcher";
import { SystemEndPointPathMap, UserEndPointPathMap } from "../end-point";

interface IUserEndPointContext {
  userEndPoint: string | null;
  userPathMap: typeof UserEndPointPathMap;
}

export const UserEndPointContext = createContext<IUserEndPointContext>({
  userEndPoint: null,
  userPathMap: {} as typeof UserEndPointPathMap,
});

export default function UserEndPointProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: userEndPointData } = useSWR(
    SystemEndPointPathMap.endPoint,
    fetcher,
  );
  const userEndPoint = useMemo(
    () => userEndPointData?.end_point,
    [userEndPointData],
  );
  console.log(userEndPointData, userEndPoint);

  const [userPathMap, setPathMap] = useState({} as typeof UserEndPointPathMap);

  useEffect(() => {
    if (!userEndPoint) return;

    const newMap = UserEndPointPathMap;
    const keys = Object.keys(UserEndPointPathMap) as Array<
      keyof typeof UserEndPointPathMap
    >;

    keys.map((key) => {
      newMap[key] = `${userEndPoint}${UserEndPointPathMap[key]}`;
    });

    setPathMap(newMap);
  }, [userEndPoint]);

  return (
    <UserEndPointContext.Provider
      value={{
        userEndPoint: userEndPointData,
        userPathMap,
      }}
    >
      {children}
    </UserEndPointContext.Provider>
  );
}
