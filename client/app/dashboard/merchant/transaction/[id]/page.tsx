"use client";

import React, { useEffect } from "react";
import { useTransactionStore } from "@/state/transactionStore";
import { useCustomerStore } from "@/state/customerStore";
import { useProductStore } from "@/state/productStore";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import RouteHandler from "@/components/routeHandler";
import { useParams } from "next/navigation";

export default function TransactionDetail() {
  const { singleTransaction, loading, fetchTransactionById } =
    useTransactionStore();
  const { customers, fetchCustomers } = useCustomerStore();
  const { products, fetchProducts } = useProductStore();
  const params = useParams();

  useEffect(() => {
    if (params.id) {
      fetchTransactionById(Number(params.id));
      fetchCustomers();
      fetchProducts();
    }
  }, [params.id, fetchTransactionById, fetchCustomers, fetchProducts]);

  if (loading) return <div className="text-center py-6">Loading...</div>;

  const customer = singleTransaction?.customer;
  const productNames = singleTransaction?.products
    .map((product) => product.product_name)
    .join(", ");

  return (
    <RouteHandler isProtected={true}>
      <div className="p-12">
        <div className="flex justify-between items-center mb-6">
          <CardTitle className="text-3xl">
            Transaction ID: {singleTransaction?.id}
          </CardTitle>
          <Link
            href={`/dashboard/merchant/transaction/edit/${singleTransaction?.id}`}
          >
            <Button variant="secondary">Edit Transaction</Button>
          </Link>
        </div>

        <Card className="h-full grid items-center justify-center">
          <CardHeader>
            <CardTitle>Transaction Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p>
                <strong>Status:</strong> {singleTransaction?.status}
              </p>
              <p>
                <strong>Customer Name:</strong>{" "}
                {customer
                  ? `${customer.first_name} ${customer.last_name}`
                  : "N/A"}
              </p>
              <p>
                <strong>Product Names:</strong> {productNames || "N/A"}
              </p>
              <p>
                <strong>Payment Method:</strong> {singleTransaction?.payment}
              </p>
              <p>
                <strong>Total:</strong> ₱
                {singleTransaction?.productTotal.toFixed(2)}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </RouteHandler>
  );
}
