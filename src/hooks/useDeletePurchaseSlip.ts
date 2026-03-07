import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useDeletePurchaseSlip() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(
        `http://localhost:5001/api/purchase-slips/${id}`,
        { method: "DELETE" },
      );

      if (!res.ok) throw new Error("Failed to delete slip");

      return res.json();
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["purchase-slips"] });
    },
  });
}
