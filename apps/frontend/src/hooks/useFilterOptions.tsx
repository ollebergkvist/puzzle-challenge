// libs
import { useEffect, useState } from "preact/hooks";

// utils
import { getUniqueValues } from "../utils";

export const useFilterOptions = (data: any[], property: string) => {
  const [options, setOptions] = useState<string[]>([]);

  useEffect(() => {
    setOptions(getUniqueValues(data, property));
  }, [data, property]);

  return options;
};
