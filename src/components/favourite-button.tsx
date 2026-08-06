import { Heart } from "lucide-react"
import { useState } from "react"
import { motion, useReducedMotion } from "motion/react"

import { cn } from "@/lib/utils"
import { useFavourites, useIsFavourite } from "@/store/use-favourites"

const BURST_PARTICLES = 7
const PARTICLE_COLORS = [
    "text-rose-300",
    "text-orange-300",
    "text-amber-200",
    "text-emerald-300",
    "text-sky-300",
    "text-violet-300",
    "text-pink-300",
]

type FavouriteButtonProps = {
    id: string
    className?: string
}

export function FavouriteButton({ id, className }: FavouriteButtonProps) {
    const favourite = useIsFavourite(id)
    const toggleFavourite = useFavourites((state) => state.toggle)
    const reduceMotion = useReducedMotion()
    const [burstKey, setBurstKey] = useState(0)

    const popped = favourite && burstKey > 0

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
            <motion.span
                key={popped ? `pop-${burstKey}` : "steady"}
                {...(popped && !reduceMotion ? { animate: { scale: [1, 1.3, 1] } } : {})}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="inline-flex"
            >
                <Heart
                    className={cn("size-5", favourite ? "fill-rose-500 text-rose-500" : "text-rose-500")}
                    aria-hidden
                />
            </motion.span>
            {burstKey > 0 && !reduceMotion && <Burst key={burstKey} />}
        </button>
    )
}

function Burst() {
    return (
        <span aria-hidden className="pointer-events-none absolute inset-0">
            {Array.from({ length: BURST_PARTICLES }, (_, i) => {
                const angle = Math.PI * (0.18 + 0.64 * (i / (BURST_PARTICLES - 1)))
                const distance = 26 + (i % 3) * 8
                const twinkleDip = 0.45 + ((i * 17) % 30) / 100
                const flickerStart = 0.45 + ((i * 13) % 25) / 100
                return (
                    <motion.span
                        key={i}
                        initial={{ x: 0, y: 0, scale: 0.4, rotate: 0, filter: "hue-rotate(0deg)" }}
                        animate={{
                            x: Math.cos(angle) * distance,
                            y: -Math.sin(angle) * distance,
                            scale: 1,
                            rotate: (i - 3) * 10,
                            filter: ["hue-rotate(0deg)", "hue-rotate(360deg)"],
                        }}
                        transition={{ duration: 0.55, ease: "easeOut", delay: 0.02 + 0.015 * (i % 3) }}
                        className={cn(
                            "absolute top-1/2 left-1/2 -mt-1.5 -ml-1.5",
                            PARTICLE_COLORS[i % PARTICLE_COLORS.length],
                        )}
                    >
                        <TwinkleParticle delay={0.02 + 0.015 * (i % 3)} start={flickerStart} dip={twinkleDip} />
                    </motion.span>
                )
            })}
        </span>
    )
}

function TwinkleParticle({ delay, start, dip }: { delay: number; start: number; dip: number }) {
    return (
        <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 1, dip, 0.9, dip * 0.8, 0] }}
            transition={{
                duration: 0.55,
                ease: "easeOut",
                delay,
                times: [0, 0.08, start, start + 0.12, start + 0.22, 0.82, 1],
            }}
            className="block"
        >
            <Heart className="size-3 fill-current" />
        </motion.span>
    )
}
