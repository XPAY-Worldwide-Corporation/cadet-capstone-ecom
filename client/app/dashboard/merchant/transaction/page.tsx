"use client";

import React, { useEffect } from "react";
import { useTransactionStore } from "@/state/transactionStore";
import { useCustomerStore } from "@/state/customerStore";
import { useProductStore } from "@/state/productStore";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import RouteHandler from "@/components/routeHandler";

export default function TransactionListPage() {
  const { transactions, loading, fetchTransactions, deleteTransaction } =
    useTransactionStore();
  const { customers, fetchCustomers } = useCustomerStore();
  const { products, fetchProducts } = useProductStore();

  useEffect(() => {
    fetchTransactions();
    fetchCustomers();
    fetchProducts();
  }, [fetchTransactions, fetchCustomers, fetchProducts]);

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this transaction?")) {
      deleteTransaction(id);
    }
  };

  const isValidTransaction = (customerId: number, productIds: number[]) => {
    const customerExists = customers?.some(
      (customer) => customer.id === customerId,
    );
    const allProductsExist = productIds?.every((productId) =>
      products.some((product) => product.id === productId),
    );

    return customerExists && allProductsExist;
  };

  if (loading) return <div className="text-center py-6">Loading...</div>;

  return (
    <RouteHandler isProtected={true}>
      <div className="p-12">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-semibold">Transaction List</h1>
        </div>

        {transactions.length > 0 ? (
          <Table className="w-full table-auto bg-white shadow-md rounded-lg text-base">
            <TableHeader>
              <TableRow className="bg-gray-200">
                <TableHead className="p-4 text-left">Transaction ID</TableHead>
                <TableHead className="p-4 text-left">Customer Name</TableHead>
                <TableHead className="p-4 text-left">Product Names</TableHead>
                <TableHead className="p-4 text-left">Payment Method</TableHead>
                <TableHead className="p-4 text-left">Product Total</TableHead>
                <TableHead className="p-4 text-left">Status</TableHead>
                <TableHead className="p-4 text-left">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions?.map((transaction) => {
                const isValid = isValidTransaction(
                  transaction?.customerId,
                  transaction?.products.map((p) => p.id),
                );

                const customerName = `${transaction?.customer?.first_name} ${transaction?.customer?.last_name}`;
                const productNames = transaction?.products
                  .map((product) => product?.product_name)
                  .join(", ");

                return (
                  <TableRow
                    key={transaction?.id}
                    className={`hover:bg-gray-100 ${isValid ? "" : "bg-red-100"}`}
                  >
                    <TableCell className="p-4">
                      <Link
                        href={`/dashboard/merchant/transaction/${transaction?.id}`}
                      >
                        {transaction?.id}
                      </Link>
                    </TableCell>
                    <TableCell className="p-4">{customerName}</TableCell>
                    <TableCell className="p-4">{productNames}</TableCell>
                    <TableCell className="p-4">
                      {transaction?.payment}
                    </TableCell>
                    <TableCell className="p-4">
                      ₱{transaction?.productTotal.toFixed(2)}
                    </TableCell>
                    <TableCell className="p-4">{transaction?.status}</TableCell>
                    <TableCell className="p-4">
                      <div className="flex space-x-4">
                        <Link
                          href={`/dashboard/merchant/transaction/edit/${transaction?.id}`}
                        >
                          <Button variant="default" disabled={!isValid}>
                            Edit
                          </Button>
                        </Link>
                        <Button
                          variant="destructive"
                          onClick={() => handleDelete(transaction?.id)}
                          disabled={!isValid}
                        >
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-6">No transactions available.</div>
        )}
      </div>
    </RouteHandler>
  );
}
