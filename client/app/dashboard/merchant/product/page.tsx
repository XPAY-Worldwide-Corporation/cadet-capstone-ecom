"use client";

import React, { useEffect } from "react";
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
import { useProductStore } from "@/state/productStore";
import { useCategoryStore } from "@/state/categoryStore";
import { useMerchantStore } from "@/state/merchantStore";

export default function ProductListPage() {
  const { products, loading, fetchProducts, deleteProduct } = useProductStore();
  const { categories, fetchCategories } = useCategoryStore();
  const { merchants, fetchMerchants } = useMerchantStore();

  useEffect(() => {
    fetchProducts();
    fetchCategories();
    fetchMerchants();
  }, [fetchProducts, fetchCategories, fetchMerchants]);

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this product?")) {
      deleteProduct(id);
    }
  };

  if (loading) return <div className="text-center py-6">Loading...</div>;

  return (
    <div className="p-12">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold">Product List</h1>
        <Link href="/dashboard/merchant/product/create">
          <Button size="lg">Create New Product</Button>
        </Link>
      </div>

      {products.length > 0 ? (
        <Table className="w-full table-auto bg-white shadow-md rounded-lg text-base">
          <TableHeader>
            <TableRow className="bg-gray-200">
              <TableHead className="p-4 text-left">Product Name</TableHead>
              <TableHead className="p-4 text-left">Category</TableHead>
              <TableHead className="p-4 text-left">Merchant</TableHead>
              <TableHead className="p-4 text-left">Images</TableHead>
              <TableHead className="p-4 text-left">Price</TableHead>
              <TableHead className="p-4 text-left">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id} className="hover:bg-gray-100">
                <TableCell className="p-4">
                  <Link href={`/dashboard/merchant/product/${product.id}`}>
                    <h2 className="text-lg font-medium">
                      {product.product_name}
                    </h2>
                  </Link>
                </TableCell>
                <TableCell className="p-4">
                  {categories.find((cat) => cat.id === product.categoryId)
                    ?.name || "Unknown"}
                </TableCell>
                <TableCell className="p-4">
                  {
                    merchants.find(
                      (merchant) => merchant.id === product.merchantId,
                    )?.first_name
                  }{" "}
                  {merchants.find(
                    (merchant) => merchant.id === product.merchantId,
                  )?.last_name || "Unknown"}
                </TableCell>
                <TableCell className="p-4">
                  <div className="flex space-x-3">
                    {product.image?.map(
                      (
                        img: { url: string; originalname: string },
                        index: number,
                      ) => (
                        <img
                          key={index}
                          src={img.url}
                          alt={img.originalname}
                          className="w-32 object-cover rounded-md"
                        />
                      ),
                    )}
                  </div>
                </TableCell>
                <TableCell className="p-4">
                  ${product.price.toFixed(2)}
                </TableCell>
                <TableCell className="p-4">
                  <div className="flex space-x-4">
                    <Link
                      href={`/dashboard/merchant/product/edit/${product.id}`}
                    >
                      <Button variant="default">Edit</Button>
                    </Link>
                    <Button
                      variant="destructive"
                      onClick={() => handleDelete(product.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <div className="text-center py-6">No products available.</div>
      )}
    </div>
  );
}
