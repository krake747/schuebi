import { MapPin } from "lucide-react";

import { BottomCard } from "@/components/bottom-card";

export function EmptyState() {
  return (
    <BottomCard className="pointer-events-none">
      <div className="mx-auto w-full max-w-md rounded-3xl bg-card/95 p-5 shadow-2xl backdrop-blur">
        <div className="flex items-center gap-2">
          <MapPin className="size-5 shrink-0 text-primary" aria-hidden />
          <span className="text-sm font-medium">Tap the map to set a meeting point.</span>
        </div>
      </div>
    </BottomCard>
  );
}
