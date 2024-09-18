"use client";

import React, { useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  FormField,
  FormItem,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import { useAuthStore } from "@/state/authStore";
import RouteHandler from "@/components/routeHandler";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  email: z.string().email("Invalid email address."),
  password: z.string().min(6, "Password must be at least 6 characters."),
});

type FormValues = z.infer<typeof formSchema>;

export default function Login() {
  const { loginUser, error, loading, user } = useAuthStore();
  const router = useRouter();

  const methods = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onBlur",
  });

  const { handleSubmit, control, formState } = methods;

  const onSubmit = async (values: FormValues) => {
    await loginUser(values.email, values.password);

    if (user) {
      const role = user.role.roleName;
      if (role === "Merchant") {
        router.push("/dashboard/merchant");
      } else if (role === "Customer") {
        router.push("/dashboard/customer");
      }
    }
  };

  return (
    <RouteHandler isProtected={false}>
      <FormProvider {...methods}>
        <div className="p-6 max-w-md mx-auto min-h-screen flex flex-col justify-center">
          <h1 className="text-2xl font-bold mb-6">Login</h1>
          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <FormField
              control={control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <Label htmlFor="email">Email:</Label>
                  <FormControl>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Email"
                      {...field}
                      className="mt-1"
                    />
                  </FormControl>
                  <FormDescription>Enter your email address.</FormDescription>
                  <FormMessage>{formState.errors.email?.message}</FormMessage>
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <Label htmlFor="password">Password:</Label>
                  <FormControl>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Password"
                      {...field}
                      className="mt-1"
                    />
                  </FormControl>
                  <FormDescription>Enter your password.</FormDescription>
                  <FormMessage>
                    {formState.errors.password?.message}
                  </FormMessage>
                </FormItem>
              )}
            />

            {error && <p className="text-red-600">{error}</p>}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </Button>
          </form>
        </div>
      </FormProvider>
    </RouteHandler>
  );
}
