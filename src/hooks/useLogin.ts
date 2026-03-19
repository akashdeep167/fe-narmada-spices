import { useMutation } from "@tanstack/react-query";
import { login } from "../api/auth";
import { useAuth } from "./useAuth";
import { useNavigate } from "react-router-dom";

export function useLogin() {
  const { login: setAuth } = useAuth();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (credentials: { username: string; password: string }) =>
      login(credentials.username, credentials.password),
    onSuccess: (data) => {
      setAuth(data.user, data.token);
      navigate("/");
    },
    onError: (error: any) => {
      console.error("Login failed:", error.message);
    },
  });
}
