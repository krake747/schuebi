import { Navigation, Share2, Trash2 } from "lucide-react"
import { motion } from "motion/react"

import { BottomSheet } from "@/components/bottom-sheet"
import { Button } from "@/components/ui/button"
import { googleMapsDirectionsUrl } from "@/utils/maps"

type ShareController = {
    mode: "create" | "shared"
    copied: boolean
    onShare: () => void
    onClear: () => void
}

type ShareSheetProps = {
    share: ShareController
    pin: { lat: number; lng: number }
}

export function ShareSheet({ share, pin }: ShareSheetProps) {
    const { mode, copied, onShare, onClear } = share

    return (
        <BottomSheet>
            {mode === "shared" ? (
                <>
                    <Button
                        size="lg"
                        className="w-full bg-emerald-500 text-white hover:bg-emerald-600"
                        render={
                            <a
                                href={googleMapsDirectionsUrl(pin.lat, pin.lng)}
                                target="_blank"
                                rel="noopener noreferrer"
                            />
                        }
                    >
                        <Navigation className="size-5" aria-hidden />
                        Navigate
                    </Button>
                    <div className="grid grid-cols-2 gap-2">
                        <Button size="lg" variant="secondary" className="w-full" onClick={onShare}>
                            <Share2 className="size-5" aria-hidden />
                            <ShareLabel copied={copied} shareLabel="Share Again" />
                        </Button>
                        <ClearPin onClear={onClear} />
                    </div>
                </>
            ) : (
                <>
                    <Button size="lg" className="w-full" onClick={onShare}>
                        <Share2 className="size-5" aria-hidden />
                        <ShareLabel copied={copied} shareLabel="Share Meeting Point" />
                    </Button>
                    <ClearPin onClear={onClear} />
                </>
            )}
        </BottomSheet>
    )
}

function ShareLabel({ copied, shareLabel }: { copied: boolean; shareLabel: string }) {
    return (
        <motion.span
            key={copied ? "copied" : "share"}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2, ease: [0.19, 1, 0.22, 1] }}
        >
            {copied ? "Link copied" : shareLabel}
        </motion.span>
    )
}

function ClearPin({ onClear }: { onClear: () => void }) {
    return (
        <Button size="lg" variant="secondary" className="w-full" onClick={onClear}>
            <Trash2 className="size-5" aria-hidden />
            Clear Pin
        </Button>
    )
}
