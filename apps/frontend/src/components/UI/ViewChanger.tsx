export const ViewChanger = ({ isLoggedIn = false }): JSX.Element => (
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

            {isLoggedIn && (
              <li>
                <Link href="/cart" className="text-white text-sm font-medium">
                  Cart
                </Link>
              </li>
            )}

            <li>
              <Link href="/login" className="text-white text-sm font-medium">
                Login
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
);
