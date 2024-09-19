"use client";

import React, { useEffect } from "react";
import { useCategoryStore } from "@/state/categoryStore";
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

export default function CategoryListPage() {
  const { categories, loading, fetchCategories, deleteCategory } =
    useCategoryStore();

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this category?")) {
      deleteCategory(id);
    }
  };

  if (loading) return <div className="text-center py-6">Loading...</div>;

  return (
    <RouteHandler isProtected={true}>
      <div className="p-12">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-semibold">Category List</h1>
          <Link href="/dashboard/merchant/category/create">
            <Button size="lg">Create New Category</Button>
          </Link>
        </div>

        {categories.length > 0 ? (
          <Table className="w-full table-auto bg-white shadow-md rounded-lg text-base">
            <TableHeader>
              <TableRow className="bg-gray-200">
                <TableHead className="p-4 text-left">Category Name</TableHead>
                <TableHead className="p-4 text-left">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((category) => {
                return (
                  <TableRow key={category.id} className="hover:bg-gray-100">
                    <TableCell className="p-4">
                      <Link
                        href={`/dashboard/merchant/category/${category.id}`}
                      >
                        <h2 className="text-lg font-medium">{category.name}</h2>
                      </Link>
                    </TableCell>
                    <TableCell className="p-4">
                      <div className="flex space-x-4">
                        <Link
                          href={`/dashboard/merchant/category/edit/${category.id}`}
                        >
                          <Button variant="default">Edit</Button>
                        </Link>
                        <Button
                          variant="destructive"
                          onClick={() => handleDelete(category.id)}
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
          <div className="text-center py-6">No categories available.</div>
        )}
      </div>
    </RouteHandler>
  );
}
