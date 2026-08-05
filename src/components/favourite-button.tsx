import { Heart } from "lucide-react"
import { useState } from "react"
import { motion } from "motion/react"

import { cn } from "@/lib/utils"
import { useFavourites } from "@/store/use-favourites"

const BURST_PARTICLES = 7

type FavouriteButtonProps = {
    id: string
    className?: string
}

export function FavouriteButton({ id, className }: FavouriteButtonProps) {
    const favourite = useFavourites((state) => state.ids.includes(id))
    const toggleFavourite = useFavourites((state) => state.toggle)
    const [burstKey, setBurstKey] = useState(0)

    return (
        <button
            type="button"
            aria-label={favourite ? "Remove from favourites" : "Add to favourites"}
            aria-pressed={favourite}
            onClick={() => {
                if (!favourite) setBurstKey((key) => key + 1)
                toggleFavourite(id)
            }}
            className={cn(
                "relative flex shrink-0 items-center justify-center transition-colors duration-150 outline-none select-none focus-visible:ring-2 focus-visible:ring-ring/70 active:scale-95",
                className,
            )}
        >
            <Heart className={cn("size-5", favourite && "fill-destructive text-destructive")} aria-hidden />
            {burstKey > 0 && <Burst key={burstKey} />}
        </button>
    )
}

function Burst() {
    return (
        <span aria-hidden className="pointer-events-none absolute inset-0">
            {Array.from({ length: BURST_PARTICLES }, (_, i) => {
                const angle = Math.PI * (0.18 + 0.64 * (i / (BURST_PARTICLES - 1)))
                const distance = 26 + (i % 3) * 8
                return (
                    <motion.span
                        key={i}
                        initial={{ x: 0, y: 0, scale: 0.4, opacity: 0, rotate: 0 }}
                        animate={{
                            x: Math.cos(angle) * distance,
                            y: -Math.sin(angle) * distance,
                            scale: 1,
                            opacity: [0, 1, 0],
                            rotate: (i - 3) * 10,
                        }}
                        transition={{ duration: 0.55, ease: "easeOut", delay: 0.02 + 0.015 * (i % 3) }}
                        className="absolute top-1/2 left-1/2 -mt-1.5 -ml-1.5 text-destructive"
                    >
                        <Heart className="size-3 fill-current" />
                    </motion.span>
                )
            })}
        </span>
    )
}
