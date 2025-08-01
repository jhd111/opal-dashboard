import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import Base_url from "../Base_url/Baseurl";

// Function to send POST request
const AddDealEmail = async ({ payload, path, contentType = "application/json" }) => {
  const token = localStorage.getItem("token");
  
  // ✅ Choose content type based on the request
  const headers = {
    "ngrok-skip-browser-warning": "true",
    Authorization: `Token ${token}`,
  };

  // ✅ Only add Content-Type for JSON (axios handles multipart automatically when needed)
  if (contentType === "application/json") {
    headers["Content-Type"] = "application/json";
  } else if (contentType === "multipart/form-data") {
    // Don't set Content-Type for multipart - let axios handle it
    // This allows axios to set the boundary automatically
  }

  const response = await axios.post(`${Base_url}/api/${path}`, payload, {
    headers,
  });
  return response.data;
};

// Custom Hook for Mutation
export const AddAddDealEmailMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: AddDealEmail,
    onSuccess: (_, variables) => {
      // Invalidate the relevant query
      queryClient.invalidateQueries({ queryKey: [variables.queryKey] });
    },
  });
};