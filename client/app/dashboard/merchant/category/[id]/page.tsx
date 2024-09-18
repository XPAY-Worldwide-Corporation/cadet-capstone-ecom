"use client";

import React, { useEffect } from "react";
import { useCategoryStore } from "@/state/categoryStore";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import RouteHandler from "@/components/routeHandler";

export default function CategoryDetail() {
  const { singleCategory, loading, fetchSingleCategory } = useCategoryStore();
  const params = useParams();

  useEffect(() => {
    if (params.id) {
      fetchSingleCategory(Number(params.id));
    }
  }, [params.id, fetchSingleCategory]);

  if (loading) return <div className="text-center py-6">Loading...</div>;

  return (
    <RouteHandler isProtected={true}>
      <div className="p-12">
        <div className="flex justify-between items-center mb-6">
          <CardTitle className="text-3xl">{singleCategory?.name}</CardTitle>
          <Link
            href={`/dashboard/merchant/category/edit/${singleCategory?.id}`}
          >
            <Button variant="secondary">Edit Category</Button>
          </Link>
        </div>

        <Card className="h-full grid items-center justify-center">
          <CardHeader>
            <CardTitle>{singleCategory?.name}</CardTitle>
          </CardHeader>
        </Card>
      </div>
    </RouteHandler>
  );
}
