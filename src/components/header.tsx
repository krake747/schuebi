import { useEffect, useState } from "react"

import { PinIcon } from "@/components/pin-icon"
import { cn } from "@/lib/utils"

export function Header() {
    const [visited] = useState(
        () => typeof sessionStorage !== "undefined" && sessionStorage.getItem("sf-visited") !== null,
    )

    useEffect(() => {
        sessionStorage.setItem("sf-visited", "1")
    }, [])

    return (
        <header className="pointer-events-none absolute inset-x-0 top-0 z-20 flex justify-center px-4 pt-[max(0.75rem,env(safe-area-inset-top))] pb-2">
            <div
                className={cn(
                    "pointer-events-auto flex -rotate-2 items-center gap-2 rounded-[0.9rem] border-[2.5px] border-dashed border-primary bg-background px-4.5 py-2 shadow-[4px_6px_0_oklch(0.6_0.15_15/0.35),6px_10px_18px_rgb(0_0_0/0.18)]",
                    !visited && "motion-safe:animate-sticker-pop motion-reduce:animate-fade-in",
                )}
            >
                <PinIcon
                    size={18}
                    className={cn(
                        "w-auto origin-[50%_100%] text-primary",
                        !visited && "motion-safe:animate-pin-bounce",
                    )}
                    aria-hidden
                />
                <div>
                    <h1 className="text-base font-extrabold text-foreground">Schuebi · Meet Up</h1>
                    <p className="hidden text-xs text-muted-foreground [@media(min-height:600px)]:block">
                        Drop a pin and share it with your friends.
                    </p>
                </div>
            </div>
        </header>
    )
}
