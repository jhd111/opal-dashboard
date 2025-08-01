import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import Base_url from "../Base_url/Baseurl";

// Function to send POST request
const AddResult = async ({ payload, path }) => {
  const token = localStorage.getItem("token");
  const response = await axios.post(`${Base_url}/api/${path}`, payload, {
    headers: {
      "Content-Type": "multipart/form-data",
      "ngrok-skip-browser-warning": "true",
      Authorization: `Token ${token}`,
    },
  });
  return response.data;
};

// Custom Hook for Mutation
export const AddResultMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: AddResult,
    onSuccess: (_, variables) => {
      // Invalidate the relevant query
      queryClient.invalidateQueries({ queryKey: [variables.queryKey] });
    },
  });
};
