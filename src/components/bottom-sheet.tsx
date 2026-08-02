import { type ReactNode } from "react"

import { BottomCard } from "@/components/bottom-card"
import { Card } from "@/components/ui/card"

type BottomSheetProps = {
    children: ReactNode
}

export function BottomSheet({ children }: BottomSheetProps) {
    return (
        <BottomCard>
            <Card className="mx-auto flex w-full max-w-md flex-col gap-2 rounded-3xl bg-card/95 p-4 shadow-2xl backdrop-blur">
                {children}
            </Card>
        </BottomCard>
    )
}
