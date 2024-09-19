"use client";

import React from "react";
import { useForm, FormProvider, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useCartStore } from "@/state/cartStore";
import { useTransactionStore } from "@/state/transactionStore";
import { useAuthStore } from "@/state/authStore";
import { useRouter } from "next/navigation";
import RouteHandler from "@/components/routeHandler";

const formSchema = z.object({
  paymentMethod: z.enum(["Cash", "Maya"], {
    errorMap: () => ({ message: "Please select a payment method." }),
  }),
});

type FormValues = z.infer<typeof formSchema>;

export default function CheckoutPage() {
  const { cartItems, totalPrice, clearCart } = useCartStore();

  const { addTransactionCash, addTransactionMaya, loading } =
    useTransactionStore();
  const { user } = useAuthStore();
  const router = useRouter();

  const methods = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      paymentMethod: "Cash",
    },
    mode: "onBlur",
  });

  const { handleSubmit, control, formState, reset } = methods;

  const onSubmit = async (values: FormValues) => {
    if (!user?.id) {
      router.push("/login");
      return;
    }

    const orderData = {
      customerId: user.id,
      productIds: cartItems.map((item) => item.product.id),
      payment: values.paymentMethod,
      productTotal: totalPrice,
    };

    try {
      if (values.paymentMethod === "Maya") {
        addTransactionMaya(orderData);
      } else {
        addTransactionCash(orderData);
      }

      clearCart();
      reset();
      router.push(`/dashboard/customer`);
    } catch (error) {
      console.error("Error placing order:", error);
    }
  };

  return (
    <RouteHandler isProtected={true}>
      <div className="p-12">
        <h1 className="text-3xl font-semibold text-center mb-8">Checkout</h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            {cartItems.map((item) => (
              <div
                key={item.product.id}
                className="shadow-lg p-4 border border-gray-200 rounded-lg"
              >
                <h2 className="text-xl font-semibold">
                  {item.product.product_name}
                </h2>
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
                  Total Price: ${item.totalPrice.toFixed(2)}
                </p>
              </div>
            ))}
          </div>

          <div className="p-6 border border-gray-200 rounded-lg shadow-md h-fit">
            <h2 className="text-2xl font-semibold mb-4">Checkout Summary</h2>
            <p className="text-lg font-semibold">
              Total Quantity:{" "}
              {cartItems.reduce((acc, item) => acc + item.quantity, 0)}
            </p>
            <p className="text-lg font-semibold">
              Total Price: ${totalPrice.toFixed(2)}
            </p>

            <div className="mt-4">
              <h3 className="text-lg font-semibold mb-2">Payment Method</h3>
              <FormProvider {...methods}>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <Controller
                    name="paymentMethod"
                    control={control}
                    render={({ field }) => (
                      <RadioGroup
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <div className="flex items-center gap-2">
                          <RadioGroupItem value="Cash" id="cash" />
                          <label htmlFor="cash" className="ml-2">
                            Cash
                          </label>
                        </div>
                        <div className="flex items-center gap-2">
                          <RadioGroupItem value="Maya" id="maya" />
                          <label htmlFor="maya" className="ml-2">
                            Maya
                          </label>
                        </div>
                      </RadioGroup>
                    )}
                  />
                  {formState.errors.paymentMethod && (
                    <span className="text-red-500 text-sm">
                      {formState.errors.paymentMethod.message}
                    </span>
                  )}

                  <div className="grid grid-cols-2 gap-x-8 mt-4 w-full">
                    <Button
                      type="button"
                      onClick={() => router.back()}
                      variant="outline"
                    >
                      Back
                    </Button>
                    <Button type="submit" disabled={loading}>
                      {loading ? "Processing..." : "Place Order"}
                    </Button>
                  </div>
                </form>
              </FormProvider>
            </div>
          </div>
        </div>
      </div>
    </RouteHandler>
  );
}
