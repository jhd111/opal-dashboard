import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Base_url from "../Base_url/Baseurl";

// Function to fetch data from the API using a dynamic path and query params
const ResultsWithName = async ({ path, name }) => {
  const token = localStorage.getItem("token");

  const response = await axios.get(`${Base_url}${path}`, {
    headers: {
      "ngrok-skip-browser-warning": "true",
      Authorization: `Token ${token}`,
    },
    params: {
      name, // This will be added as ?name=value
    },
  });

  return response.data;
};

// Custom hook to use the query with dynamic path and name as query param
export const SearchResults = (queryKeyPrefix, path, name) => {
  return useQuery({
    queryKey: [queryKeyPrefix, path, name],
    queryFn: () => ResultsWithName({ path, name }),
    enabled: !!name, // optional: only run when name is truthy
  });
};
