// libs
import { createContext } from "preact";
import { useContext, useState } from "preact/hooks";

export const ViewToggleContext = createContext<{
  activeView: string;
  setActiveView: (view: string) => void;
} | null>(null);

export const ViewToggleProvider: React.FC = ({ children }) => {
  const [activeView, setActiveView] = useState("All Products");

  return (
    <ViewToggleContext.Provider value={{ activeView, setActiveView }}>
      {children}
    </ViewToggleContext.Provider>
  );
};

export const useViewToggleContext = () => {
  const context = useContext(ViewToggleContext);

  if (!context) {
    throw new Error(
      "useViewToggleContext must be used within a ViewToggleProvider"
    );
  }

  return context;
};
