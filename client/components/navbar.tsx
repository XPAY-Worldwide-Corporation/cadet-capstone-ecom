"use client";

import React from "react";
import { FaShoppingCart } from "react-icons/fa";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/state/authStore";
import { useCartStore } from "@/state/cartStore";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "./ui/dropdown-menu";

export default function Navbar() {
  const { user } = useAuthStore();
  const { totalQuantity } = useCartStore();
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

  const handleCustomerProduct = () => {
    router.push("/dashboard/customer/product");
  };

  const handleCartClick = () => {
    if (totalQuantity > 0) {
      router.push("/dashboard/customer/cart");
    }
  };

  const handleCategory = () => {
    router.push("/dashboard/merchant/category");
  };

  const handleMerchantProduct = () => {
    router.push("/dashboard/merchant/product");
  };

  const handleMerchantTransaction = () => {
    router.push("/dashboard/merchant/transaction");
  };

  return (
    <nav className="bg-gray-800 text-white py-4 px-12 flex justify-between items-center shadow-md">
      <div className="text-xl font-bold cursor-pointer" onClick={handleHome}>
        Quick Shopping
      </div>
      <div className="space-x-6 flex items-center">
        {user && user.role.roleName === "Customer" && (
          <>
            <div className="relative">
              <Button
                onClick={handleCartClick}
                variant="ghost"
                className={`flex items-center ${
                  totalQuantity === 0 ? "cursor-not-allowed opacity-50" : ""
                }`}
                disabled={totalQuantity === 0}
              >
                <FaShoppingCart size={20} />
                <span
                  className={`absolute -top-2 -right-2 text-white text-xs rounded-full px-2 py-1 bg-gray-600 ${
                    totalQuantity === 0 ? "opacity-100" : "opacity-100"
                  }`}
                >
                  {totalQuantity || 0}
                </span>
              </Button>
            </div>
            <Button onClick={handleCustomerProduct} variant="ghost">
              Products
            </Button>
          </>
        )}
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
                onClick={handleMerchantProduct}
                className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
              >
                Product
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleMerchantTransaction}
                className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
              >
                Transaction
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
        {!user ? (
          <>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost">Register</Button>
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
