// EditResultMutation.js
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import Base_url from "../Base_url/Baseurl";

// PUT request for editing result
const EditResult = async ({ payload, path }) => {
  const token = localStorage.getItem("token");

  const response = await axios.put(`${Base_url}/api/${path}`, payload, {
    headers: {
      "Content-Type": "multipart/form-data",
      "ngrok-skip-browser-warning": "true",
      Authorization: `Token ${token}`,
    },
  });

  return response.data;
};

// Accept queryKey as parameter from parent
export const EditResultMutation = (queryKey) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: EditResult,
    onSuccess: () => {
      if (queryKey) {
        queryClient.invalidateQueries({ queryKey });
      }
    },
  });
};
