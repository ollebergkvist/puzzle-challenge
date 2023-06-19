// types
import { LayoutProps } from "../types";

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto">
        <div className="px-6 mt-[64px] py-12 lg:py-24"> {children}</div>
      </div>
    </div>
  );
};
