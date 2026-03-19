import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { createSlip } from "../api/slip";

export function useCreateSlip() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createSlip,
    onSuccess: () => {
      toast.success("Slip created successfully");
      queryClient.invalidateQueries({
        queryKey: ["purchaseSlips"],
      });
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to create slip");
    },
  });
}
