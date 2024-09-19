"use client";

import React from "react";
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
  FormMessage,
} from "@/components/ui/form";
import { useCategoryStore } from "@/state/categoryStore";
import { useRouter } from "next/navigation";
import RouteHandler from "@/components/routeHandler";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Category name must be at least 2 characters.",
  }),
});

type FormValues = z.infer<typeof formSchema>;

export default function CreateCategory() {
  const { addCategory } = useCategoryStore();
  const router = useRouter();

  const methods = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
    mode: "onBlur",
  });

  const { handleSubmit, control, formState, reset } = methods;

  const onSubmit = async (values: FormValues) => {
    try {
      addCategory(values);
      reset();
      router.push("/dashboard/merchant/category");
    } catch (error) {
      console.error("Error adding category:", error);
    }
  };

  return (
    <RouteHandler isProtected={true}>
      <div className="p-6 max-w-md mx-auto min-h-screen place-content-center">
        <h1 className="text-2xl font-bold mb-6">Create New Category</h1>
        <FormProvider {...methods}>
          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <FormField
              control={control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <Label htmlFor="name">Category Name:</Label>
                  <FormControl>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Category Name"
                      {...field}
                      className="mt-1"
                    />
                  </FormControl>
                  <FormMessage>{formState.errors.name?.message}</FormMessage>
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-x-6">
              <Button
                type="button"
                onClick={() => router.back()}
                variant="destructive"
                className="w-full mt-4"
              >
                Go Back
              </Button>
              <Button type="submit" className="w-full mt-4">
                Create Category
              </Button>
            </div>
          </form>
        </FormProvider>
      </div>
    </RouteHandler>
  );
}
