import { type ReactNode } from "react"

import { cn } from "@/lib/utils"

type BottomCardProps = {
    children: ReactNode
    className?: string
}

export function BottomCard({ children, className }: BottomCardProps) {
    return (
        <div
            className={cn(
                "absolute inset-x-0 bottom-3 z-10 px-4 pb-[max(1rem,env(safe-area-inset-bottom))]",
                className,
            )}
        >
            {children}
        </div>
    )
}
