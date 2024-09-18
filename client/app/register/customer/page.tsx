"use client";

import React, { useEffect, useState } from "react";
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
import { useCustomerStore } from "@/state/customerStore";
import { useRoleStore } from "@/state/roleStore";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  first_name: z.string().min(2, {
    message: "First name must be at least 2 characters.",
  }),
  last_name: z.string().min(2, {
    message: "Last name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Invalid email address.",
  }),
  address: z.string().min(10, {
    message: "Address must be at least 10 characters.",
  }),
  image: z.array(z.instanceof(File)).nonempty({
    message: "At least one image is required.",
  }),
  government_id: z.array(z.instanceof(File)).optional(),
  roleId: z.number().min(1, {
    message: "Please select a role.",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
});

type FormValues = z.infer<typeof formSchema>;

export default function CreateCustomer() {
  const { addCustomer } = useCustomerStore();
  const { fetchRoles, roles } = useRoleStore();
  const [customerRoleId, setCustomerRoleId] = useState<number | null>(null);
  const router = useRouter();

  const methods = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      address: "",
      image: [],
      government_id: [],
      roleId: customerRoleId ?? 0,
      password: "",
    },
    mode: "onBlur",
  });

  const { handleSubmit, control, formState, reset, setValue } = methods;

  useEffect(() => {
    const loadRoles = async () => {
      fetchRoles();

      const customerRole = roles.find((role) => role.roleName === "Customer");

      if (customerRole) {
        setCustomerRoleId(customerRole.id);
        setValue("roleId", customerRole.id);
      }
    };

    loadRoles();
  }, [fetchRoles, roles, setValue]);

  const onSubmit = async (values: FormValues) => {
    const formData = new FormData();
    formData.append("first_name", values.first_name);
    formData.append("last_name", values.last_name);
    formData.append("email", values.email);
    formData.append("address", values.address);
    values.image.forEach((file) => {
      formData.append("image", file);
    });
    if (values.government_id) {
      values.government_id.forEach((file) => {
        formData.append("government_id", file);
      });
    }
    formData.append("roleId", values.roleId.toString());
    formData.append("password", values.password);

    try {
      addCustomer(formData);
      reset();
      router.push("/login");
    } catch (error) {
      console.error("Error adding customer:", error);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto min-h-screen place-content-center">
      <h1 className="text-2xl font-bold mb-6">Create New Customer</h1>
      <FormProvider {...methods}>
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <FormField
            control={control}
            name="first_name"
            render={({ field }) => (
              <FormItem>
                <Label htmlFor="first_name">First Name:</Label>
                <FormControl>
                  <Input
                    id="first_name"
                    type="text"
                    placeholder="First Name"
                    {...field}
                    className="mt-1"
                  />
                </FormControl>
                <FormDescription>
                  Enter the first name of the customer.
                </FormDescription>
                <FormMessage>
                  {formState.errors.first_name?.message}
                </FormMessage>
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="last_name"
            render={({ field }) => (
              <FormItem>
                <Label htmlFor="last_name">Last Name:</Label>
                <FormControl>
                  <Input
                    id="last_name"
                    type="text"
                    placeholder="Last Name"
                    {...field}
                    className="mt-1"
                  />
                </FormControl>
                <FormDescription>
                  Enter the last name of the customer.
                </FormDescription>
                <FormMessage>{formState.errors.last_name?.message}</FormMessage>
              </FormItem>
            )}
          />

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
                <FormDescription>
                  Enter the customer's email address.
                </FormDescription>
                <FormMessage>{formState.errors.email?.message}</FormMessage>
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <Label htmlFor="address">Address:</Label>
                <FormControl>
                  <Input
                    id="address"
                    type="text"
                    placeholder="Address"
                    {...field}
                    className="mt-1"
                  />
                </FormControl>
                <FormDescription>Enter the customer's address.</FormDescription>
                <FormMessage>{formState.errors.address?.message}</FormMessage>
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="image"
            render={({ field }) => (
              <FormItem>
                <Label htmlFor="image">Upload Image:</Label>
                <FormControl>
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => {
                      if (e.target.files) {
                        field.onChange(Array.from(e.target.files));
                      }
                    }}
                  />
                </FormControl>
                <FormDescription>
                  Upload at least one image of the customer.
                </FormDescription>
                <FormMessage>{formState.errors.image?.message}</FormMessage>
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="government_id"
            render={({ field }) => (
              <FormItem>
                <Label htmlFor="government_id">
                  Upload Government ID (Optional):
                </Label>
                <FormControl>
                  <Input
                    id="government_id"
                    type="file"
                    accept="image/*,application/pdf"
                    multiple
                    onChange={(e) => {
                      if (e.target.files) {
                        field.onChange(Array.from(e.target.files));
                      }
                    }}
                  />
                </FormControl>
                <FormDescription>
                  Upload government ID(s) for verification.
                </FormDescription>
                <FormMessage>
                  {formState.errors.government_id?.message}
                </FormMessage>
              </FormItem>
            )}
          />

          <input type="hidden" {...methods.register("roleId")} />

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
                <FormDescription>
                  Enter a password for the customer.
                </FormDescription>
                <FormMessage>{formState.errors.password?.message}</FormMessage>
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full">
            Create Customer
          </Button>
        </form>
      </FormProvider>
    </div>
  );
}
