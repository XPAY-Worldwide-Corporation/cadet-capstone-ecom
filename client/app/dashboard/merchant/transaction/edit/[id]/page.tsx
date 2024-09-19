"use client";

import React, { useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useTransactionStore } from "@/state/transactionStore";
import { useRouter, useParams } from "next/navigation";
import RouteHandler from "@/components/routeHandler";
import {
  FormField,
  FormItem,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";

const formSchema = z.object({
  status: z.enum(["Pending", "Completed", "Refunded"], {
    errorMap: () => ({ message: "Please select a valid status." }),
  }),
});

type FormValues = z.infer<typeof formSchema>;

export default function EditTransactionStatus() {
  const {
    singleTransaction,
    fetchTransactionById,
    updateTransactionStatus,
    loading,
  } = useTransactionStore();
  const router = useRouter();
  const { id } = useParams();

  const methods = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      status: "Pending",
    },
    mode: "onBlur",
  });

  const { handleSubmit, control, formState, reset } = methods;

  useEffect(() => {
    if (id) {
      fetchTransactionById(Number(id));
    }
  }, [id, fetchTransactionById]);

  useEffect(() => {
    if (singleTransaction) {
      reset({
        status: singleTransaction.status as
          | "Pending"
          | "Completed"
          | "Refunded",
      });
    }
  }, [singleTransaction, reset]);

  const onSubmit = async (values: FormValues) => {
    try {
      if (id) {
        updateTransactionStatus(Number(id), values.status);
        router.push("/dashboard/merchant/transaction");
      }
    } catch (error) {
      console.error("Error updating transaction:", error);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <RouteHandler isProtected={true}>
      <div className="p-6 max-w-md mx-auto min-h-screen place-content-center">
        <h1 className="text-2xl font-bold mb-6">Edit Transaction Status</h1>
        <FormProvider {...methods}>
          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <FormField
              control={control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <Label htmlFor="status">Transaction Status:</Label>
                  <FormControl>
                    <select
                      id="status"
                      value={field.value}
                      onChange={field.onChange}
                      className="mt-1 border rounded p-2"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Completed">Completed</option>
                      <option value="Refunded">Refunded</option>
                    </select>
                  </FormControl>
                  <FormDescription>
                    Select the current status of the transaction.
                  </FormDescription>
                  <FormMessage>{formState.errors.status?.message}</FormMessage>
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
                Update Status
              </Button>
            </div>
          </form>
        </FormProvider>
      </div>
    </RouteHandler>
  );
}
