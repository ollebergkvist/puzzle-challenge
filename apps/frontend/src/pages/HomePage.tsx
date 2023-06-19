// libs
import { route } from "preact-router";

// types
import type { JSX } from "preact/jsx-runtime";

// context
import { useAuthContext, useViewToggleContext } from "../context";

// hooks
import {
  useFilterOptions,
  useFilter,
  useFetchData,
  useDebouncedSearch,
  useFilterClick,
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

  const { products, loading } = useFetchData();
  const categories = useFilterOptions(products, "category");
  const titles = useFilterOptions(products, "title");

  const {
    selectedValues: selectedTitles,
    handleFilterChange: handleTitleFilterChange,
  } = useFilter();

  const {
    selectedValues: selectedCategories,
    handleFilterChange: handleCategoryFilterChange,
  } = useFilter();

  const { filteredProducts, isFiltering } = useFilterClick(
    selectedTitles,
    selectedCategories,
    import.meta.env.VITE_API_URL
  );

  const {
    searchQuery,
    handleSearchQueryChange,
    searchedProducts,
    isSearching,
    searchError,
  } = useDebouncedSearch(`${import.meta.env.VITE_API_URL}/products`);

  const handleAddItemToCart = (event) => {
    const { value } = event.target;
  };

  const shouldShowFilteredProducts = filteredProducts.length > 0;

  const shouldShowSearchedProducts =
    searchedProducts.length > 0 && !loading && !isFiltering;

  const shouldShowAllProducts =
    products.length > 1 &&
    !loading &&
    searchedProducts.length === 0 &&
    !isFiltering &&
    !searchError;

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
                  {shouldShowFilteredProducts ? (
                    <Products
                      products={filteredProducts}
                      handleOnClick={handleAddItemToCart}
                    />
                  ) : (
                    <div>
                      {loading && !isFiltering ? (
                        <LoadingSpinner />
                      ) : (
                        <>
                          {shouldShowSearchedProducts ? (
                            <Products
                              products={searchedProducts}
                              handleOnClick={handleAddItemToCart}
                            />
                          ) : null}

                          {shouldShowAllProducts ? (
                            <Products
                              products={products}
                              handleOnClick={handleAddItemToCart}
                            />
                          ) : null}

                          {searchError ? <p>{searchError}</p> : null}
                        </>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}

        {activeView === "My Orders" && (
          <>
            {isAuthenticated ? (
              <Orders />
            ) : (
              (() => {
                route("/login");
              })()
            )}
          </>
        )}
      </main>
    </div>
  );
};
