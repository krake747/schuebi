import { BottomCard } from "@/components/bottom-card";
import { Card } from "@/components/ui/card";
import { PinIcon } from "@/components/pin-icon";

export function EmptyState() {
  return (
    <BottomCard className="pointer-events-none">
      <Card className="mx-auto flex w-full max-w-sm items-center gap-2 rounded-2xl bg-card/95 p-4 shadow-2xl backdrop-blur">
        <PinIcon className="w-auto shrink-0 size-5 text-primary" aria-hidden />
        <p className="text-sm font-medium">Tap the map to set a meeting point.</p>
      </Card>
    </BottomCard>
  );
}
