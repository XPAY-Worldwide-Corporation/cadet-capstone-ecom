"use client";

import React from "react";
import RouteHandler from "@/components/routeHandler";
import { useAuthStore } from "@/state/authStore";

export default function CustomerDashboard() {
  const { user } = useAuthStore();

  return (
    <RouteHandler isProtected={true}>
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-5xl font-bold mb-4">
            Hello {user?.first_name} {user?.last_name}!
          </h1>
          <p className="text-xl mb-8">
            Manage your shopping preferences and orders products you like.
          </p>
          <img
            src="/welcome.png"
            alt="E-Commerce"
            className="object-cover w-fit h-fit mx-auto"
          />
        </div>
      </div>
    </RouteHandler>
  );
}
