import { useEffect, useState } from "react";

export default function useFetchData(endpoint) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL =
  window.location.hostname.includes("cloudshell")
    ? "https://3001-cs-281831690367-default.cs-us-east1-yeah.cloudshell.dev" // Use Cloud Shell API if UI is in Cloud Shell
    : window.location.hostname.includes("localhost")
    ? "http://localhost:3001" // Use Local API if UI is in localhost
    : window.location.hostname.includes("workstation") 
    ? "https://3001-my-workstation.cluster-5sn52swtxneecwkdgwfk2ddxuo.cloudworkstations.dev" // workstation
    : "https://api-744920990938.northamerica-northeast1.run.app";



  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${API_URL}/${endpoint}`, { credentials: "include" });

        if (!response.ok) {
          const text = await response.text(); // Read raw response
          throw new Error(`Error ${response.status}: ${text}`);
        }

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



