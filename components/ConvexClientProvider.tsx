"use client";

import { ConvexProvider, ConvexReactClient } from "convex/react";
import { ReactNode } from "react";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export function ConvexClientProvider({ children }: { children: ReactNode }) {
  return (
    // ✅ h-full here is critical — without it the height chain breaks
    // and everything below collapses to 0 on mobile
    <ConvexProvider client={convex}>
      <div className="h-full">{children}</div>
    </ConvexProvider>
  );
}