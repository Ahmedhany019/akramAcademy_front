import React from "react";
import { cn } from "../../utils/cn";

export default function Skeleton({ className = "" }) {
  return (
    <div
      className={cn(
        "animate-pulse bg-gray-200/80 rounded-xl",
        className
      )}
    />
  );
}
