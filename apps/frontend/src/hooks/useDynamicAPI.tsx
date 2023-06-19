import { useState } from "react";

export const useDynamicAPI = (token: string, url: string, method = "GET") => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [items, setItems] = useState([]);
  const [success, setSuccess] = useState(false);

  const fetchData = async (requestData = null) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(url, {
        method,
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
        body: method !== "GET" ? JSON.stringify(requestData) : undefined,
      });

      if (!response.ok) {
        throw new Error("API request failed");
      }

      if (method === "GET") {
        const data = await response.json();
        setItems(data);
      }

      setIsLoading(false);
      setSuccess(true);
    } catch (error) {
      console.error("API request failed:", error);

      setError(error);
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    items,
    success,
    fetchData,
  };
};
