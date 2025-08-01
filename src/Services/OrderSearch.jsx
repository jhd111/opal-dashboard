// utils/api.js or in your existing API file


import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Base_url from "../Base_url/Baseurl";

const ResultsWithOrderId = async ({ path, order_id }) => {
    const token = localStorage.getItem("token");
  
    const response = await axios.get(`${Base_url}${path}`, {
      headers: {
        "ngrok-skip-browser-warning": "true",
        Authorization: `Token ${token}`,
      },
      params: {
        order_id, // 👈 Now using correct parameter
      },
    });
  
    return response.data;
  };
  
  // New custom hook
  export const SearchResultsByOrderId = (queryKeyPrefix, path, order_id) => {
    return useQuery({
      queryKey: [queryKeyPrefix, path, order_id],
      queryFn: () => ResultsWithOrderId({ path, order_id }),
      enabled: !!order_id, // Only run if order_id is provided
    });
  };