"use client";
import { error, success } from "@/redux/reducers/notification_slice";
import { create_order } from "@/redux/reducers/order_slice";
import { AppDispatch } from "@/redux/store";
import Image from "next/image";
import React, { useState } from "react";
import { useDispatch } from "react-redux";

interface CheckOutCartModalProps {
  setCheckOut: React.Dispatch<React.SetStateAction<boolean>>;
  cart_id: number;
}

export default function CheckOutCartModal({
  setCheckOut,
  cart_id,
}: CheckOutCartModalProps) {
  const [mop, setMop] = useState("PAY ONLINE");
  const [destination, setDestination] = useState("");
  const [message, setMessage] = useState("");
  const dispatch = useDispatch<AppDispatch>();
  const Loader = () => {
    return (
      <div className="bg-black opacity-75 w-full h-full absolute inset-0 flex flex-col text-white justify-center items-center">
        <Image src={"/icons/loading.svg"} alt="" width={70} height={70} />
        <h1>Please wait</h1>
      </div>
    );
  };
  return (
    <div className="fixed inset-0 w-full h-screen bg-black bg-opacity-80 flex justify-center items-center z-20 p-[1rem]">
      <div className="bg-white w-full sm:w-3/4 md:w-1/2 lg:w-1/4 p-2 space-y-2 relative">
        <div className="bg-gray-400 h-[75px] text-white flex justify-center items-center text-2xl"></div>
        <div className="flex gap-2">
          <h1 className="w-full">MODE OF PAYMENT</h1>
          <select
            title="MODE OF PAYMENT"
            className="border-b border-black w-full"
            onChange={(e) => setMop(e.target.value)}
          >
            <option value={"PAY ONLINE"}>PAYONLINE</option>
            <option value={"CASH ON DELIVERY"}>CASH ON DELIVERY</option>
          </select>
        </div>
        <input
          type="text"
          className="border-b border-black w-full p-1 focus:outline-none"
          placeholder="destination"
          onChange={(e) => setDestination(e.target.value)}
        />
        <textarea
          className="border-b border-black w-full p-1 focus:outline-none"
          placeholder="(optional custom message)"
          rows={5}
          onChange={(e) => setMessage(e.target.value)}
        />
        <div className="flex gap-2">
          <button
            className="bg-black text-white text-base w-full p-1 rounded-lg"
            onClick={() =>
              dispatch(
                create_order({
                  mode_of_payment: mop,
                  destination,
                  message,
                  cart_id,
                })
              ).then((res: any) => {
                if (res.error) {
                  dispatch(error(res.error.message));
                } else {
                  setCheckOut(false);
                  dispatch(success("Order has been created!"));
                }
              })
            }
          >
            PLACE ORDER
          </button>
          <button
            className="bg-black text-white text-base w-full p-1 rounded-lg"
            onClick={() => setCheckOut(false)}
          >
            CANCEL
          </button>
        </div>
      </div>
    </div>
  );
}
