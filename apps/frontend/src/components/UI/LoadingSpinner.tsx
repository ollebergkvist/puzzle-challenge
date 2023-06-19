// types
import type { JSX } from "preact/jsx-runtime";

export const LoadingSpinner = (): JSX.Element => (
  <div className="flex justify-center mt-4">
    <div className="animate-spin rounded-full p-4 bg-gradient-to-tr from-green-500 to-blue-500 via-purple-500">
      <div className="bg-white rounded-full w-24 h-24"></div>
    </div>
  </div>
);
