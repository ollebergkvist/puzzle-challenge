// libs
import { useState } from "preact/hooks";

export const useViewToggle = (initialView: string) => {
  const [activeView, setActiveView] = useState(initialView);

  const handleViewToggle = (view: string) => {
    setActiveView(view);
  };

  return { activeView, handleViewToggle };
};
