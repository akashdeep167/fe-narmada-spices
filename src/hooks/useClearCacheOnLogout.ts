import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "./useAuth";

export function useClearCacheOnLogout(): void {
  const queryClient = useQueryClient();
  const { token } = useAuth();

  useEffect(() => {
    // Clear cache when token changes (logout) or user switches
    const handleStorageChange = () => {
      const newToken = localStorage.getItem("token");
      if (!newToken && token === null) {
        // Token was cleared (logout)
        queryClient.clear();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [token, queryClient]);

  // Also clear cache when token becomes null (logout in same tab)
  useEffect(() => {
    if (token === null) {
      queryClient.clear();
    }
  }, [token, queryClient]);
}
