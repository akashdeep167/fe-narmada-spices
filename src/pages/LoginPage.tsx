import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Logo from "../assets/logo.png";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../components/ui/form";

const loginSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormData = z.infer<typeof loginSchema>;

const LoginPage = () => {
  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      userId: "",
      password: "",
    },
  });

  const handleLogin = (data: LoginFormData) => {
    console.log("Login Data:", data);
  };

  return (
    <div className="flex flex-col gap-12 min-h-screen items-center">
      <div>
        <img className="h-50 w-auto" src={Logo} alt="Narmada Spices Logo" />
      </div>
      <div className="text-center">
        <h1 className="text-4xl font-bold">Login</h1>
        <p className="text-sm text-muted-foreground mt-2">
          All fields are mandatory
        </p>
      </div>
      <div className="w-full max-w-md rounded-xl border bg-card p-8 shadow-sm">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleLogin)}
            className="w-full max-w-sm space-y-6"
          >
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
                    <Input
                      type="password"
                      placeholder="Enter Password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">
              LOGIN
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default LoginPage;
