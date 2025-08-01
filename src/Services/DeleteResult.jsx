// DeleteResultMutation.js
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import Base_url from "../Base_url/Baseurl";

// Function to call DELETE with FormData
const DeleteResultFormData = async ({ id, path }) => {
  const token = localStorage.getItem("token");

  const formData = new FormData();
  formData.append("id", id);

  const response = await axios.delete(`${Base_url}/api/${path}`, {
    data: formData,
    headers: {
      "ngrok-skip-browser-warning": "true",
      Authorization: `Token ${token}`,
      // Let axios set Content-Type
    },
  });

  return response.data;
};

// Custom hook with dynamic query key
export const useDeleteResultMutation = (queryKey) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: DeleteResultFormData,
    onSuccess: () => {
      if (queryKey) {
        queryClient.invalidateQueries({ queryKey });
      }
    },
    onError: (error) => {
      console.error("Full error object:", error);
      console.error("Error response:", error.response);
      console.error("Error data:", error.response?.data);
      console.error("Error status:", error.response?.status);
    },
  });
};
