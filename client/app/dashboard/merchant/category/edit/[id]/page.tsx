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
import { useCategoryStore } from "@/state/categoryStore";
import { useRouter, useParams } from "next/navigation";
import RouteHandler from "@/components/routeHandler";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Category name must be at least 2 characters.",
  }),
});

type FormValues = z.infer<typeof formSchema>;

export default function EditCategory() {
  const { singleCategory, fetchSingleCategory, updateCategory, loading } =
    useCategoryStore();
  const router = useRouter();
  const { id } = useParams();

  const methods = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
    mode: "onBlur",
  });

  const { handleSubmit, control, formState, reset } = methods;

  useEffect(() => {
    if (id) {
      fetchSingleCategory(Number(id));
    }
  }, [id, fetchSingleCategory]);

  useEffect(() => {
    if (singleCategory) {
      reset({
        name: singleCategory.name || "",
      });
    }
  }, [singleCategory, reset]);

  const onSubmit = async (values: FormValues) => {
    const isImageUpload = false;

    if (isImageUpload) {
      const formData = new FormData();
      formData.append("name", values.name);

      try {
        if (id) {
          updateCategory(Number(id), formData);
          router.push("/dashboard/merchant/category");
        }
      } catch (error) {
        console.error("Error updating category:", error);
      }
    } else {
      try {
        if (id) {
          updateCategory(Number(id), { name: values.name });
          router.push("/dashboard/merchant/category");
        }
      } catch (error) {
        console.error("Error updating category:", error);
      }
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <RouteHandler isProtected={true}>
      <div className="p-6 max-w-md mx-auto min-h-screen place-content-center">
        <h1 className="text-2xl font-bold mb-6">Edit Category</h1>
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
                  <FormDescription>
                    Enter the name of the category.
                  </FormDescription>
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
                Update Category
              </Button>
            </div>
          </form>
        </FormProvider>
      </div>
    </RouteHandler>
  );
}
