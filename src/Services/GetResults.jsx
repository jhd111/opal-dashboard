import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Base_url from "../Base_url/Baseurl";

// Function to fetch data from the API using a dynamic path
const Results = async (path) => {
  const token = localStorage.getItem("token");

  const response = await axios.get(`${Base_url}${path}`, {
    headers: {
      "ngrok-skip-browser-warning": "true",
      Authorization: `Token ${token}`,
    },
  });

  return response.data;
};

// Custom hook to use the query with a dynamic path
export const fetchResults = (queryKeyPrefix, path) => {
  return useQuery({
    queryKey: [queryKeyPrefix, path],
    queryFn: () => Results(path),
    staleTime: 2 * 60 * 1000, // cache stays fresh for 5 minutes
    cacheTime: 3 * 60 * 1000, // keep in cache for 10 minutes
  });
};
