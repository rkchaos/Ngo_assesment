import React from "react";
import { Loader2 } from "lucide-react";

export function LoadingSpinner({ size = 24, className = "" }) {
  return (
    <Loader2
      size={size}
      className={`animate-spin text-gray-600 ${className}`}
    />
  );
}
