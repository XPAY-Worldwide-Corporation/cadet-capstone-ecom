"use client";

import React from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/state/authStore";

export default function Navbar() {
  const { user } = useAuthStore();
  const router = useRouter();

  const handleHome = () => {
    router.push("/");
  };

  const handleLogin = () => {
    router.push("/login");
  };

  const handleCustomerRegister = () => {
    router.push("/register/customer");
  };

  const handleMerchantRegister = () => {
    router.push("/register/merchant");
  };

  const handleLogout = async () => {
    await useAuthStore.getState().logoutUser();
    router.push("/login");
  };

  const handleCategory = () => {
    router.push("/dashboard/merchant/category");
  };

  const handleProduct = () => {
    router.push("/dashboard/merchant/product");
  };

  return (
    <nav className="bg-gray-800 text-white py-4 px-12 flex justify-between items-center shadow-md">
      <div className="text-xl font-bold cursor-pointer" onClick={handleHome}>
        Quick Shopping
      </div>
      <div className="space-x-6">
        {user && user.role.roleName === "Merchant" && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost">Tables</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-white text-black mt-2 rounded shadow-lg">
              <DropdownMenuItem
                onClick={handleCategory}
                className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
              >
                Category
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleProduct}
                className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
              >
                Product
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
        {!user ? (
          <>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="bg-gray-600 hover:bg-gray-700">
                  Register
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-white text-black mt-2 rounded shadow-lg">
                <DropdownMenuItem
                  onClick={handleCustomerRegister}
                  className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
                >
                  Customer
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleMerchantRegister}
                  className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
                >
                  Merchant
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button onClick={handleLogin} variant="ghost">
              Login
            </Button>
          </>
        ) : (
          <Button onClick={handleLogout} variant="ghost">
            Logout
          </Button>
        )}
      </div>
    </nav>
  );
}
