import { useState, useEffect } from "react";

const useEffectStore = <T, F>(
  store: (callback: (state: T) => unknown) => unknown,
  callback: (state: T) => F,
) => {
  const result = store(callback) as F;
  const [data, setData] = useState<F | null>(null);

  useEffect(() => {
    setData(result);
  }, [result]);

  return data;
};

export default useEffectStore;
