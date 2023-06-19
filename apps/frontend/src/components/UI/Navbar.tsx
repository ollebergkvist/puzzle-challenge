// libs
import { Link } from "preact-router";

// context
import { useAuthContext } from "../../context";

// types
import type { JSX } from "preact/jsx-runtime";

export const Navbar = (): JSX.Element => {
  const { isAuthenticated, logout } = useAuthContext();

  return (
    <div>
      <div className="fixed top-0 left-0 w-full z-50 border-b bg-blue-900">
        <div className="mx-auto max-w-7xl px-6">
          <div className="relative flex h-16 justify-between">
            <div className="flex flex-1 items-stretch justify-start"></div>

            <ul className="flex-shrink-0 flex py-3 space-x-2 items-center">
              <li>
                <Link href="/" className="text-white text-sm font-medium">
                  Home
                </Link>
              </li>

              {isAuthenticated && (
                <li>
                  <Link href="/cart" className="text-white text-sm font-medium">
                    Cart
                  </Link>
                </li>
              )}

              {!isAuthenticated ? (
                <li>
                  <Link
                    href="/login"
                    className="text-white text-sm font-medium"
                  >
                    Login
                  </Link>
                </li>
              ) : (
                <li className="text-white text-sm font-medium">
                  <button onClick={() => logout()}>Logout</button>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
