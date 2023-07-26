import { useState } from "react";

export const useStrNum = (
  defaultVal?: string,
): [string | undefined, (val: string) => void] => {
  const [numVal, setNumVal] = useState(defaultVal);

  const handleChange = (val: string | null) => {
    if (!val) {
      setNumVal(undefined);
      return;
    }

    val = val.replace(/[^0-9.]|(?<=\..*)\./g, "");

    setNumVal(val);
  };

  return [numVal, handleChange];
};
