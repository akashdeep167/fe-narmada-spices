import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { setTokenExpirationHandler } from "../api/auth";
import { useAuth } from "./useAuth";

export function useTokenExpiration(): void {
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handler = () => {
      // Clear auth state
      logout();

      // Show toast notification
      toast.error("Your session has expired. Please log in again.");

      // Redirect to login
      navigate("/login", { replace: true });
    };

    setTokenExpirationHandler(handler);

    // Cleanup on unmount
    return () => {
      setTokenExpirationHandler(null);
    };
  }, [logout, navigate]);
}
