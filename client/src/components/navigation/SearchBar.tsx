"use client";
import { search_product } from "@/redux/reducers/products_slice";
import { AppDispatch } from "@/redux/store";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import React, { useState } from "react";
import { useDispatch } from "react-redux";

export default function SearchBar() {
  const [name, setName] = useState("");
  const dispatch = useDispatch<AppDispatch>();
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div className="flex">
      <input
        type="search"
        placeholder="Search product"
        className={`focus:outline-none px-2 border-b border-black w-full md:w-3/4 lg:w-full`}
        onChange={(e) => setName(e.target.value)}
      />
      <button
        onClick={() => {
          if (pathname === "/products") {
            dispatch(search_product(name));
          } else {
            router.push("/products");
          }
        }}
      >
        <Image src={"/icons/search.svg"} alt="" width={30} height={30} />
      </button>
    </div>
  );
}
