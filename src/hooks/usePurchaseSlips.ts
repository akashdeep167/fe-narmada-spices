import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { getPurchaseSlips } from "@/api/slip";

export function usePurchaseSlips(params: any) {
  return useQuery({
    queryKey: ["purchaseSlips", params],
    queryFn: () => getPurchaseSlips(params),
    placeholderData: keepPreviousData,
  });
}
