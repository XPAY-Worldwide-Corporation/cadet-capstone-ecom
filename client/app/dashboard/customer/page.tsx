"use client";

import React from "react";
import RouteHandler from "@/components/routeHandler";

export default function CustomerDashboard() {
  return (
    <RouteHandler isProtected={true}>
      <div>
        <h1>Customer Dashboard</h1>
      </div>
    </RouteHandler>
  );
}
