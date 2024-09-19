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
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { useProductStore } from "@/state/productStore";
import { useCategoryStore } from "@/state/categoryStore";
import { useRouter, useParams } from "next/navigation";
import RouteHandler from "@/components/routeHandler";

const formSchema = z.object({
  product_name: z.string().min(2, {
    message: "Product name must be at least 2 characters.",
  }),
  price: z.number().min(0, {
    message: "Price must be a positive number.",
  }),
  image: z.array(z.instanceof(File)).optional(),
  categoryId: z.number().min(1, {
    message: "Please select a category.",
  }),
});

type FormValues = z.infer<typeof formSchema>;

export default function EditProduct() {
  const { singleProduct, fetchSingleProduct, updateProduct, loading, error } =
    useProductStore();
  const { fetchCategories, categories } = useCategoryStore();
  const router = useRouter();
  const { id } = useParams();

  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null,
  );

  const methods = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      product_name: "",
      price: 0,
      image: [],
      categoryId: 0,
    },
    mode: "onBlur",
  });

  const { handleSubmit, control, formState, reset, setValue } = methods;

  useEffect(() => {
    if (id) {
      fetchSingleProduct(Number(id));
      fetchCategories();
    }
  }, [id, fetchSingleProduct, fetchCategories]);

  useEffect(() => {
    if (singleProduct) {
      setExistingImages(singleProduct.image.map((img) => img.url));
      setSelectedCategoryId(singleProduct.categoryId);
      reset({
        product_name: singleProduct.product_name || "",
        price: singleProduct.price || 0,
        image: [],
        categoryId: singleProduct.categoryId || 0,
      });
    }
  }, [singleProduct, reset]);

  const onSubmit = async (values: FormValues) => {
    const formData = new FormData();
    formData.append("product_name", values.product_name);
    formData.append("price", values.price.toString());
    values.image?.forEach((file) => {
      formData.append("image", file);
    });
    formData.append("categoryId", values.categoryId.toString());
    formData.append("merchantId", singleProduct?.merchantId.toString() || "");
    try {
      if (id) {
        updateProduct(Number(id), formData, () =>
          router.push("/dashboard/merchant/product"),
        );
      }
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <RouteHandler isProtected={true}>
      <div className="p-6 max-w-md mx-auto min-h-screen place-content-center">
        <h1 className="text-2xl font-bold mb-6">Edit Product</h1>
        <FormProvider {...methods}>
          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <FormField
              control={control}
              name="product_name"
              render={({ field }) => (
                <FormItem>
                  <Label htmlFor="product_name">Product Name:</Label>
                  <FormControl>
                    <Input
                      id="product_name"
                      type="text"
                      placeholder="Product Name"
                      {...field}
                      className="mt-1"
                    />
                  </FormControl>
                  <FormDescription>
                    Enter the name of the product.
                  </FormDescription>
                  <FormMessage>
                    {formState.errors.product_name?.message}
                  </FormMessage>
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <Label htmlFor="price">Price:</Label>
                  <FormControl>
                    <Input
                      id="price"
                      type="number"
                      placeholder="Product Price"
                      value={field.value || ""}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                      className="mt-1"
                    />
                  </FormControl>
                  <FormDescription>
                    Enter the price of the product.
                  </FormDescription>
                  <FormMessage>{formState.errors.price?.message}</FormMessage>
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="image"
              render={({ field: { onChange, onBlur } }) => (
                <FormItem>
                  <Label htmlFor="image">Image:</Label>
                  <FormControl>
                    <Input
                      id="image"
                      type="file"
                      multiple
                      onChange={(event) => {
                        if (event.currentTarget.files) {
                          onChange(Array.from(event.currentTarget.files));
                        }
                      }}
                      onBlur={onBlur}
                      className="mt-1 cursor-pointer"
                    />
                  </FormControl>
                  <FormDescription>
                    Upload new images for the product. Existing images will be
                    kept unless removed.
                  </FormDescription>
                  <FormMessage>{formState.errors.image?.message}</FormMessage>
                </FormItem>
              )}
            />

            <FormItem>
              <Label htmlFor="categoryId">Select Category:</Label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="w-full mt-1">
                    {selectedCategoryId
                      ? categories.find(
                          (category) => category.id === selectedCategoryId,
                        )?.name
                      : "Select a category"}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {categories.map((category) => (
                    <DropdownMenuItem
                      key={category.id}
                      onClick={() => {
                        setSelectedCategoryId(category.id);
                        setValue("categoryId", category.id);
                      }}
                    >
                      {category.name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              <FormDescription>
                Choose the category for this product.
              </FormDescription>
              <FormMessage>{formState.errors.categoryId?.message}</FormMessage>
            </FormItem>

            <h2 className="text-lg font-semibold">Existing Images</h2>
            <div className="mt-4 flex flex-col items-center justify-center">
              <div className="w-full mt-2 grid grid-cols-3 gap-2">
                {existingImages.map((url) => (
                  <img
                    key={url}
                    src={url}
                    alt="Product Image"
                    className="w-full h-auto object-cover rounded-md"
                  />
                ))}
              </div>
            </div>

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
                Update Product
              </Button>
            </div>
          </form>
        </FormProvider>
      </div>
    </RouteHandler>
  );
}
