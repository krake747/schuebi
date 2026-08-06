import { Sparkles } from "lucide-react"

import { BottomCard } from "@/components/bottom-card"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { PinIcon } from "@/components/pin-icon"

type EmptyStateProps = {
    disabled: boolean
    onSurprise: () => void
}

export function EmptyState({ disabled, onSurprise }: EmptyStateProps) {
    return (
        <BottomCard className="pointer-events-none">
            <Card className="pointer-events-auto mx-auto flex w-full max-w-sm flex-col items-stretch gap-3 rounded-2xl bg-card/95 p-4 shadow-2xl backdrop-blur">
                <div className="flex items-center justify-center gap-2">
                    <PinIcon className="size-5 w-auto shrink-0 text-primary" aria-hidden />
                    <p className="text-sm font-medium">Tap the map to set a meeting point.</p>
                </div>
                <Button size="lg" onClick={onSurprise} disabled={disabled}>
                    <Sparkles className="size-4" aria-hidden />
                    Surprise me
                </Button>
            </Card>
        </BottomCard>
    )
}
