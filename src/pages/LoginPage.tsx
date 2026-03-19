import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Logo from "../assets/logo.png";
import { useTranslation } from "react-i18next";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../components/ui/form";
import { useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useLogin } from "@/hooks/useLogin";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

const loginSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormData = z.infer<typeof loginSchema>;

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { t } = useTranslation();
  const loginMutation = useLogin();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Redirect to home if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      userId: "",
      password: "",
    },
  });

  const handleLogin = async (data: LoginFormData) => {
    try {
      await loginMutation.mutateAsync({
        username: data.userId,
        password: data.password,
      });
    } catch (error: any) {
      form.setError("root", {
        message: error.message || "Login failed. Please try again.",
      });
    }
  };

  // Don't show login form if already authenticated
  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="flex flex-col gap-12 min-h-screen items-center p-4 pt-16">
      <div>
        <img className="h-20 w-auto" src={Logo} alt="Narmada Spices Logo" />
      </div>
      <div className="text-center">
        <h1 className="text-4xl font-bold">{t("login")}</h1>
        <p className="text-sm text-muted-foreground mt-2">
          {t("allFieldsMandatory")}
        </p>
      </div>
      <div className="w-full max-w-md rounded-xl border bg-card p-8 shadow-sm">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleLogin)}
            className="w-full max-w-sm space-y-6"
          >
            {form.formState.errors.root && (
              <div className="text-sm text-red-500 bg-red-50 p-3 rounded">
                {form.formState.errors.root.message}
              </div>
            )}
            <FormField
              control={form.control}
              name="userId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>User ID *</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter User ID" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password *</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter Password"
                        {...field}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                      >
                        {showPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full"
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? "LOGGING IN..." : "LOGIN"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default LoginPage;
