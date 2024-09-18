"use client";

import React, { useEffect } from "react";
import { useProductStore } from "@/state/productStore";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import RouteHandler from "@/components/routeHandler";

export default function ProductDetail() {
  const { singleProduct, loading, fetchSingleProduct } = useProductStore();
  const params = useParams();

  useEffect(() => {
    if (params.id) {
      fetchSingleProduct(Number(params.id));
    }
  }, [params.id, fetchSingleProduct]);

  if (loading) return <div className="text-center py-6">Loading...</div>;

  const images = singleProduct?.image || [];
  const categoryName = singleProduct?.category?.name || "Unknown";
  const merchantName = singleProduct?.merchant
    ? `${singleProduct.merchant.first_name} ${singleProduct.merchant.last_name}`
    : "Unknown";

  return (
    <RouteHandler isProtected={true}>
      <div className="p-12">
        <div className="flex flex-col gap-4 mb-6">
          <div className="flex justify-between items-center">
            <CardTitle className="text-3xl">
              {singleProduct?.product_name}
            </CardTitle>
            <Link
              href={`/dashboard/merchant/product/edit/${singleProduct?.id}`}
            >
              <Button variant="secondary">Edit Product</Button>
            </Link>
          </div>
          <div className="flex flex-wrap gap-4 place-content-center">
            {images.map((img, index) => (
              <Card key={index} className="w-96">
                <CardHeader>
                  <img
                    src={img.url}
                    alt={img.originalname}
                    className="w-full object-cover rounded-md"
                  />
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">{img.originalname}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="mt-4">
            <p className="text-lg font-semibold">Category: {categoryName}</p>
            <p className="text-lg font-semibold">Merchant: {merchantName}</p>
          </div>
        </div>
      </div>
    </RouteHandler>
  );
}
