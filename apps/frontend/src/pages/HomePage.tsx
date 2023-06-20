// libs
import { route } from "preact-router";
import { useEffect } from "preact/hooks";

// types
import type { JSX } from "preact/jsx-runtime";

// context
import { useAuthContext, useViewToggleContext } from "../context";

// utils
import { getProductsUrl } from "../utils";

// hooks
import {
  useFilterOptions,
  useFilter,
  useFetchData,
  useDebouncedSearch,
} from "../hooks";

// components
import {
  Filter,
  LoadingSpinner,
  Orders,
  Products,
  Search,
} from "../components";

export const HomePage = (): JSX.Element => {
  const { isAuthenticated } = useAuthContext();
  const { activeView, setActiveView } = useViewToggleContext();

  const {
    selectedValues: selectedTitles,
    handleFilterChange: handleTitleFilterChange,
  } = useFilter();

  const {
    selectedValues: selectedCategories,
    handleFilterChange: handleCategoryFilterChange,
  } = useFilter();

  const {
    searchQuery,
    handleSearchQueryChange,
    searchedProducts,
    isSearching,
    searchError,
  } = useDebouncedSearch(getProductsUrl);

  const { products, unfilteredProducts, loading } = useFetchData(
    selectedTitles,
    selectedCategories
  );

  const categories = useFilterOptions(unfilteredProducts, "category");
  const titles = useFilterOptions(unfilteredProducts, "title");

  const handleAddItemToCart = (event) => {
    const { value } = event.target;
  };

  useEffect(() => {
    if (activeView === "My Orders" && !isAuthenticated) {
      route("/login");
    }
  }, [activeView, isAuthenticated]);

  return (
    <div className="">
      {activeView === "All Products" || activeView === "My Orders" ? (
        <div className="">
          <div className="relative flex h-16 justify-between">
            <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
              <div className="flex space-x-8">
                <div
                  className={`inline-flex items-center border-b-2 ${
                    activeView === "All Products"
                      ? "border-indigo-500"
                      : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                  }  px-1 pt-1 text-sm font-medium text-gray-900`}
                >
                  <button onClick={() => setActiveView("All Products")}>
                    All Products
                  </button>
                </div>

                <div
                  href="#"
                  className={`inline-flex items-center border-b-2 ${
                    activeView === "My Orders"
                      ? "border-indigo-500"
                      : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                  }  px-1 pt-1 text-sm font-medium `}
                >
                  <button onClick={() => setActiveView("My Orders")}>
                    My Orders
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      <main className="flex mt-4 flex-col">
        {activeView === "All Products" && (
          <div>
            <Search
              value={searchQuery}
              handleOnChange={handleSearchQueryChange}
            />

            <div className="flex flex-col">
              <div className="flex space-x-3 mt-4">
                <Filter
                  buttonTitle="Filter by title"
                  filterTitle="Title"
                  values={titles}
                  selectedValues={selectedTitles}
                  handleFilterChange={handleTitleFilterChange}
                />

                <Filter
                  buttonTitle="Filter by category"
                  filterTitle="Category"
                  selectedValues={selectedCategories}
                  values={categories}
                  handleFilterChange={handleCategoryFilterChange}
                />
              </div>

              {isSearching ? (
                <LoadingSpinner />
              ) : (
                <>
                  {loading ? (
                    <LoadingSpinner />
                  ) : (
                    <>
                      {searchedProducts.length > 0 ? (
                        <Products
                          products={searchedProducts}
                          handleOnClick={handleAddItemToCart}
                        />
                      ) : (
                        <Products
                          products={products}
                          handleOnClick={handleAddItemToCart}
                        />
                      )}

                      {searchError ? <p>{searchError}</p> : null}
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        )}

        {activeView === "My Orders" && isAuthenticated && <Orders />}
      </main>
    </div>
  );
};
