"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useCartStore } from "@/state/cartStore";
import RouteHandler from "@/components/routeHandler";

export default function CartPage() {
  const { cartItems, totalQuantity, totalPrice, removeFromCart } =
    useCartStore();
  const router = useRouter();

  const handleCheckout = () => {
    router.push("/dashboard/customer/checkout");
  };

  const handleRemoveItem = (productId: number) => {
    removeFromCart(productId);
  };

  return (
    <RouteHandler isProtected={true}>
      <div className="p-12">
        <h1 className="text-3xl font-semibold text-center mb-8">Your Cart</h1>
        {totalQuantity === 0 ? (
          <p className="text-center py-6">Your cart is empty.</p>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-6">
              {cartItems.map((item) => (
                <Card key={item.product.id} className="shadow-lg">
                  <CardHeader>
                    <CardTitle>{item.product.product_name}</CardTitle>
                  </CardHeader>

                  <CardContent>
                    <div className="mb-4">
                      <div className="flex items-center justify-center space-x-3 overflow-x-auto">
                        {item.product.image?.map((img, index) => (
                          <img
                            key={index}
                            src={img.url}
                            alt={img.originalname}
                            className="w-32 h-32 object-cover rounded-md"
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-center">Quantity: {item.quantity}</p>
                    <p className="text-center">
                      Total Price: ₱{item.totalPrice.toFixed(2)}
                    </p>
                  </CardContent>

                  <CardFooter className="flex justify-end">
                    <Button
                      variant="outline"
                      onClick={() => handleRemoveItem(item.product.id)}
                    >
                      Remove
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>

            <div className="p-6 border border-gray-200 rounded-lg shadow-md h-fit">
              <h2 className="text-2xl font-semibold mb-4">Checkout Summary</h2>
              <p className="text-lg font-semibold">
                Total Quantity: {totalQuantity}
              </p>
              <p className="text-lg font-semibold">
                Total Price: ₱{totalPrice.toFixed(2)}
              </p>
              <div className="grid grid-cols-2 gap-x-8 mt-4 w-full">
                <Button
                  onClick={() => {
                    router.back();
                  }}
                  variant="outline"
                >
                  Back
                </Button>
                <Button onClick={handleCheckout}>Continue to Checkout</Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </RouteHandler>
  );
}
