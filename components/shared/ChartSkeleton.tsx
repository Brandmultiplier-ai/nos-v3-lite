"use client";

import { useEffect, useState } from "react";

interface ChartSkeletonProps {
  height?: number;
  className?: string;
}

export function ChartSkeleton({ height = 200, className = "" }: ChartSkeletonProps) {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setShow(false), 300);
    return () => clearTimeout(t);
  }, []);

  if (!show) return null;

  return (
    <div
      className={`skeleton-shimmer rounded-lg ${className}`}
      style={{ height }}
    />
  );
}
