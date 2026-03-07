import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updatePurchaseSlip } from "@/api/slip";

export function useUpdatePurchaseSlip() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Record<string, any> }) =>
      updatePurchaseSlip(id, data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["purchaseSlips"],
      });
    },
  });
}
