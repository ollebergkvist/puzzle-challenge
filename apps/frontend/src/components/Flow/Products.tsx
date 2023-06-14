// types
import type React from "preact/compat";
import type { JSX } from "preact/jsx-runtime";
import { priceFormatter } from "../../libs/price-formatter";

interface ProductsProps {
  products: Record<string, string>[];
  handleOnClick: (event: React.TargetedEvent<HTMLButtonElement>) => void;
}

export const Products = ({
  products,
  handleOnClick,
}: ProductsProps): JSX.Element => (
  <div>
    <section className="w-fit mx-auto grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 justify-items-center justify-center gap-y-20 gap-x-14 mt-10 mb-5">
      {products.length >= 1 &&
        products.map((item) => (
          <div className="w-72 bg-white shadow-md rounded-xl duration-500 hover:scale-105 hover:shadow-xl">
            <img
              src={item.image}
              alt="Product"
              className="h-80 w-72 object-cover rounded-t-xl"
            />

            <div className="px-4 py-3 w-72">
              <p className="text-lg font-bold text-black truncate block capitalize">
                {item.title}
              </p>

              <p className="text-gray-400 mr-3 mt-2 uppercase italic text-xs">
                {item.category}
              </p>

              <p className="text-gray-400 mr-3 mt-2 uppercase italic text-xs">
                {item.rating.rate}
              </p>

              <div className="flex items-center">
                <p className="text-lg font-semibold text-black cursor-auto my-3">
                  {`$${priceFormatter(item.price)} `}
                </p>

                <button className="ml-auto" onClick={handleOnClick}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    fill="currentColor"
                    class="bi bi-bag-plus"
                    viewBox="0 0 16 16"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M8 7.5a.5.5 0 0 1 .5.5v1.5H10a.5.5 0 0 1 0 1H8.5V12a.5.5 0 0 1-1 0v-1.5H6a.5.5 0 0 1 0-1h1.5V8a.5.5 0 0 1 .5-.5z"
                    />
                    <path d="M8 1a2.5 2.5 0 0 1 2.5 2.5V4h-5v-.5A2.5 2.5 0 0 1 8 1zm3.5 3v-.5a3.5 3.5 0 1 0-7 0V4H1v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4h-3.5zM2 5h12v9a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V5z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ))}
    </section>
  </div>
);
