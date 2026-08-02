import { Navigation, Share2, Trash2 } from "lucide-react"

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
                        size="full"
                        className="bg-emerald-500 text-white hover:bg-emerald-600"
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
                        <Button size="full" variant="secondary" onClick={onShare}>
                            <Share2 className="size-5" aria-hidden />
                            {copied ? "Link copied" : "Share Again"}
                        </Button>
                        <ClearPin onClear={onClear} />
                    </div>
                </>
            ) : (
                <>
                    <Button size="full" onClick={onShare}>
                        <Share2 className="size-5" aria-hidden />
                        {copied ? "Link copied" : "Share Meeting Point"}
                    </Button>
                    <ClearPin onClear={onClear} />
                </>
            )}
        </BottomSheet>
    )
}

function ClearPin({ onClear }: { onClear: () => void }) {
    return (
        <Button size="full" variant="secondary" onClick={onClear}>
            <Trash2 className="size-5" aria-hidden />
            Clear Pin
        </Button>
    )
}
