// libs
import { useEffect, useState } from "preact/hooks";

// components
import {
  Filter,
  LoadingSpinner,
  Login,
  Navbar,
  Orders,
  Products,
  Search,
} from "./components";
import { getUniqueValues } from "./libs/get-unique-values";

export function App() {
  const [products, setProducts] = useState([]);
  const [queriedProducts, setQueriedProducts] = useState([]);
  const [cachedProducts, setCachedProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");

  const [activeView, setActiveView] = useState("All Products");

  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [categories, setCategories] = useState([]);
  const [titles, setTitles] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const isCached = cachedProducts.find((item) => item.query === query);

    if (isCached) {
      setQueriedProducts(isCached.products);

      return;
    }

    const debouncedFilter = setTimeout(() => {
      const filteredItems = products.filter((item) => {
        if (item.title.toLowerCase().includes(query)) {
          return true;
        }
      });

      setCachedProducts([
        ...cachedProducts,
        { query, products: filteredItems },
      ]);
      setQueriedProducts(filteredItems);
    }, 300);

    return () => clearTimeout(debouncedFilter);
  }, [query]);

  useEffect(() => {
    setCategories(getUniqueValues(products, "category"));
    setTitles(getUniqueValues(products, "title"));
  }, [products]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch("https://fakestoreapi.com/products");
      const result = await response.json();

      setProducts(result);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const inputHandler = (event) => {
    const { value } = event.target;

    setQuery(value.toLowerCase());
  };

  const handleAddItemToCart = (event) => {
    const { value } = event.target;

    setQuery(value.toLowerCase());
  };

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleViewToggle = (view: string) => {
    setActiveView(view);
  };

  const displayProducts = query ? queriedProducts : products;

  return (
    <div>
      <Navbar handleOnClick={handleViewToggle} />

      {activeView === "All Products" || activeView === "My Orders" ? (
        <div className="mt-[64px]">
          <button onClick={() => handleViewToggle("All Products")}>
            All Products
          </button>

          <button onClick={() => handleViewToggle("My Orders")}>
            My Orders
          </button>
        </div>
      ) : null}

      <main className="flex py-[5rem] flex-col">
        {activeView === "All Products" && (
          <div>
            <Search value={query} handleOnChange={inputHandler} />

            <div className="flex">
              <Filter
                buttonTitle="Filter by title"
                filterTitle="Title"
                values={titles}
              />

              <Filter
                buttonTitle="Filter by category"
                filterTitle="Category"
                values={categories}
              />

              {!loading ? (
                <Products
                  products={displayProducts}
                  handleOnClick={handleAddItemToCart}
                />
              ) : (
                <LoadingSpinner />
              )}
            </div>
          </div>
        )}

        {activeView === "My Orders" && (
          <>
            {isAuthenticated ? (
              <Orders />
            ) : (
              <p>Please log in to view your orders.</p>
            )}
          </>
        )}

        {activeView === "Login" && (
          <>
            <Login />
          </>
        )}
      </main>
    </div>
  );
}
