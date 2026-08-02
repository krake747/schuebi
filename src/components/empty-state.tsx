import { MapPin } from "lucide-react"

import { BottomCard } from "@/components/bottom-card"
import { Card } from "@/components/ui/card"

export function EmptyState() {
    return (
        <BottomCard className="pointer-events-none">
            <Card className="mx-auto flex w-full max-w-md items-center gap-2 rounded-3xl bg-card/95 p-4 shadow-2xl backdrop-blur">
                <MapPin className="size-5 shrink-0 text-primary" aria-hidden />
                <span className="text-sm font-medium">Tap the map to set a meeting point.</span>
            </Card>
        </BottomCard>
    )
}
