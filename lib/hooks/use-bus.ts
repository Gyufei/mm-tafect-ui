import { useEffect } from "react";

let subscribers: Array<[Filter, Callback]> = [];

type Filter = string | string[] | RegExp | ((...args: any[]) => boolean);
type Callback = (...args: any[]) => void;
type DispatchEvent = string | { type: string } | { [key: string]: any };

const BusSubscribe = (filter: Filter, callback: any) => {
  if (filter === undefined || filter === null) return undefined;
  if (callback === undefined || callback === null) return undefined;

  subscribers = [...subscribers, [filter, callback]];

  return () => {
    subscribers = subscribers.filter(
      (subscriber) => subscriber[1] !== callback,
    );
  };
};

export const BusDispatch = (event: DispatchEvent) => {
  const type = typeof event === "string" ? event : event.type;

  const args: Array<DispatchEvent> = [];
  if (typeof event === "string") args.push({ type });
  else args.push(event);

  subscribers.forEach(([filter, callback]) => {
    if (typeof filter === "string" && filter !== type) return;
    if (Array.isArray(filter) && !filter.includes(type)) return;
    if (filter instanceof RegExp && !filter.test(type)) return;
    if (typeof filter === "function" && !filter(...args)) return;

    callback(...args);
  });
};

const useBus = (type: Filter, callback: Callback, deps = []) => {
  useEffect(() => BusSubscribe(type, callback), deps);

  return BusDispatch;
};

export default useBus;
