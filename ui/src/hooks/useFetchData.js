import { useEffect, useState } from "react";

export default function useFetchData(endpoint) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // const API_URL = import.meta.env.VITE_API_URL || "https://localhost:3000";
   
  // Set API URL based on environment
  const getApiUrl = () => {
    if (typeof window !== "undefined") {
      const hostname = window.location.hostname;

      if (hostname.includes("run")) {
        return "https://ui-744920990938.northamerica-northeast1.run.app"; // Cloud Run API URL
      } else if (hostname.includes("cloudshell")) {
        return "https://3001-cs-281831690367-default.cs-us-east1-yeah.cloudshell.dev"; // Cloud Shell API URL
      } else if (hostname === "localhost") {
        return "http://localhost:3000"; // Local development API
      }
    }

    return import.meta.env.VITE_API_URL || "https://localhost:3000"; // Fallback API URL
  };

  const API_URL = getApiUrl();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${API_URL}/${endpoint}`, { credentials: "include" });
        if (!response.ok) throw new Error(`Error: ${response.statusText}`);

        const result = await response.json();
        setData(result);
      } catch (err) {
        console.error(`Error fetching ${endpoint}:`, err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [API_URL, endpoint]);

  return { data, loading, error };
}