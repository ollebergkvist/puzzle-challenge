// types
import type { JSX } from "preact/jsx-runtime";

interface NavbarProps {
  handleOnClick: (event: React.TargetedEvent<HTMLButtonElement>) => void;
}

export const Navbar = ({ handleOnClick }: NavbarProps): JSX.Element => (
  <div>
    <div className="fixed top-0 left-0 w-full z-50 border-b bg-blue-900">
      <div className="mx-auto max-w-7xl px-6">
        <div className="relative flex h-16 justify-between">
          <div className="flex flex-1 items-stretch justify-start"></div>

          <div className="flex-shrink-0 flex  py-3 items-center">
            <button
              onClick={() => handleOnClick("Login")}
              className="text-white text-sm font-medium"
            >
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
);
