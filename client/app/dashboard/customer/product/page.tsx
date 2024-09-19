"use client";

import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useProductStore } from "@/state/productStore";
import { useCategoryStore } from "@/state/categoryStore";
import { useCartStore } from "@/state/cartStore";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import RouteHandler from "@/components/routeHandler";

export default function CustomerProductList() {
  const { products, loading, fetchProducts } = useProductStore();
  const { categories, fetchCategories } = useCategoryStore();
  const { addToCart } = useCartStore();

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [fetchProducts, fetchCategories]);

  const handleAddToCart = (productId: number) => {
    const product = products.find((prod) => prod.id === productId);
    if (product) {
      addToCart(product);
    }
  };

  if (loading) return <div className="text-center py-6">Loading...</div>;

  return (
    <RouteHandler isProtected={true}>
      <div className="p-12">
        <h1 className="text-3xl font-semibold text-center mb-8">
          Shop Products
        </h1>

        {products.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-center justify-center">
            {products.map((product) => (
              <Card key={product.id} className="shadow-lg">
                <CardHeader>
                  <CardTitle>{product.product_name}</CardTitle>
                </CardHeader>

                <CardContent>
                  <div className="mb-4">
                    <div className="flex items-center justify-center space-x-3 overflow-x-auto">
                      {product.image?.map(
                        (
                          img: { url: string; originalname: string },
                          index: number,
                        ) => (
                          <img
                            key={index}
                            src={img.url}
                            alt={img.originalname}
                            className="w-32 h-32 object-cover rounded-md"
                          />
                        ),
                      )}
                    </div>
                  </div>
                  <p className="text-center">
                    Category:{" "}
                    {categories.find((cat) => cat.id === product.categoryId)
                      ?.name || "Unknown"}
                  </p>
                  <p className="text-end">Price: ₱{product.price.toFixed(2)}</p>
                </CardContent>

                <CardFooter className="flex justify-end">
                  <Button onClick={() => handleAddToCart(product.id)}>
                    Add to Cart
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-6">No products available.</div>
        )}
      </div>
    </RouteHandler>
  );
}
