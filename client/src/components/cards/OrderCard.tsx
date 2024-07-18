"use client";
import { Order } from "@/redux/reducers/order_slice";
import { useRouter } from "next/navigation";
import React from "react";

interface OrderCardProps {
  order: Order | null;
}

export default function OrderCard({ order }: OrderCardProps) {
  const router = useRouter();

  const Skeleton = () => {
    return (
      <div className="h-[200px] w-full border p-2">
        <div className="h-[50px] py-2 border-b border-black">
          <div className="w-full bg-gray-400 h-full"></div>
        </div>
        <div className="h-[150px] py-2 space-y-2">
          <div className="w-[60%] bg-gray-400 h-[20px]"></div>
          <div className="w-[30%] bg-gray-400 h-[20px]"></div>
          <div className="w-[40%] bg-gray-400 h-[20px]"></div>
          <div className="w-[70%] bg-gray-400 h-[20px]"></div>
        </div>
      </div>
    );
  };

  const ShowData = () => {
    return (
      <div
        className={`h-[200px] w-full border p-2 ${
          order?.status !== "CANCELLED"
            ? "cursor-pointer hover:border-black"
            : "cursor-not-allowed bg-gray-400"
        }`}
        onClick={() => {
          if (order?.status != "CANCELLED") {
            router.push(`/orders/${order?.id}`);
          }
        }}
      >
        <div className="h-1/4 py-2 border-b border-black flex justify-between">
          <div className="w-full h-full">{order?.status}</div>
          <h1 className="w-full h-full">{order?.mode_of_payment}</h1>
        </div>
        <div className="h-3/4 py-2 space-y-2 overflow-hidden">
          <h1>{order?.destination}</h1>
          <h1>{`$${order?.total}`}</h1>
          <div>
            <h1 className="border-t border-black">MESSAGE</h1>
            <h1>{order?.message}</h1>
          </div>
        </div>
      </div>
    );
  };

  return <div>{order ? <ShowData /> : <Skeleton />}</div>;
}
