"use client";

import Lottie from "lottie-react";

import warehouseLoadingAnimation from "@/lottie/warehouse-loading-animation.json";

export default function AppLoader() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
      }}
    >
      <div style={{ width: 280, maxWidth: "70vw" }}>
        <Lottie animationData={warehouseLoadingAnimation} loop autoplay />
      </div>
    </div>
  );
}
