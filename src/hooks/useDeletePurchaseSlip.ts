import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getAuthHeader } from "@/api/auth";
import config from "@/config";

export function useDeletePurchaseSlip() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`${config.apiBaseUrl}/api/purchase-slips/${id}`, {
        method: "DELETE",
        headers: {
          ...getAuthHeader(),
        } as HeadersInit,
      });

      if (!res.ok) throw new Error("Failed to delete slip");

      return res.json();
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["purchaseSlips"] });
    },
  });
}
