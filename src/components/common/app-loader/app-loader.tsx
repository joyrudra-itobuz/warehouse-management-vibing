"use client";

import Lottie from "lottie-react";

import warehouseLoadingAnimation from "@/lottie/warehouse-loading-animation.json";

type AppLoaderProps = {
  minHeight?: string;
};

export default function AppLoader({ minHeight = "100vh" }: AppLoaderProps) {
  return (
    <div
      style={{
        minHeight,
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
