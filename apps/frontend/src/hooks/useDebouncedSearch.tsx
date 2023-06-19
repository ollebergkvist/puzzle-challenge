// libs
import { useState, useEffect, useCallback } from "preact/hooks";
import { debounce } from "lodash";

export const useDebouncedSearch = (apiUrl: string) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchedProducts, setSearchedProducts] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState("");

  const debouncedSearch = useCallback(
    debounce(async (query) => {
      try {
        if (query === "") {
          setSearchedProducts([]);
          setIsSearching(false);
          setSearchError("");

          return;
        }

        setIsSearching(true);

        const endpoint = `${apiUrl}/search?query=${encodeURIComponent(query)}`;

        const response = await fetch(endpoint);
        const data = await response.json();

        if (response.ok) {
          setSearchedProducts(data);
          setSearchError("");
        } else {
          setSearchedProducts([]);
          setSearchError(data.message);
        }

        setIsSearching(false);
      } catch (error) {
        console.error("Error retrieving filtered products:", error);

        setSearchedProducts([]);
        setSearchError("An unexpected error occurred");
        setIsSearching(false);
      }
    }, 300),
    []
  );

  useEffect(() => {
    debouncedSearch(searchQuery);

    return () => {
      debouncedSearch.cancel();
    };
  }, [searchQuery, debouncedSearch]);

  const handleSearchQueryChange = (event) => {
    setSearchQuery(event.target.value);
  };

  return {
    searchQuery,
    handleSearchQueryChange,
    searchedProducts,
    isSearching,
    searchError,
  };
};
