import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createSlip } from "../api/slip";

export function useCreateSlip() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createSlip,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["purchaseSlips"],
      });
    },
  });
}
