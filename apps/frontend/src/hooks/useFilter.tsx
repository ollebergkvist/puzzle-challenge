// libs
import { useState, useEffect } from "preact/hooks";

export const useFilter = () => {
  const [selectedValues, setSelectedValues] = useState<string[]>([]);

  const handleFilterChange = (selectedValues: string[]) => {
    setSelectedValues(selectedValues);
  };

  useEffect(() => {}, [selectedValues]);

  return { selectedValues, handleFilterChange };
};
