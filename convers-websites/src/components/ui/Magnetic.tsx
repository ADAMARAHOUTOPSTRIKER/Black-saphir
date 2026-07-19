"use client";

import { useRef, type ReactNode } from "react";
import { useMagnetic } from "@/hooks/useMagnetic";

/** Wrapper that makes its child lean toward the cursor.
 *  Note: keep display utilities on a parent element — this wrapper owns
 *  its own `inline-block` so the transform has a box to move. */
export default function Magnetic({
  children,
  strength = 16,
  className = "",
}: {
  children: ReactNode;
  strength?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useMagnetic(ref, strength);
  return (
    <div ref={ref} style={{ display: "inline-block" }} className={className}>
      {children}
    </div>
  );
}
