import { MapPin } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import type { Attraction } from "@/data/attractions"

type AttractionFooterProps = {
    attraction: Attraction
    onMeetHere: (attraction: Attraction) => void
}

export function AttractionFooter({ attraction, onMeetHere }: AttractionFooterProps) {
    return (
        <>
            <Separator />
            <div className="mt-auto flex shrink-0 flex-col gap-2 p-4" data-slot="drawer-footer">
                <Button className="hit-area-y-1 w-full overflow-hidden" onClick={() => onMeetHere(attraction)}>
                    <MapPin className="size-4 shrink-0" aria-hidden />
                    <span className="min-w-0 truncate">Meet here at {attraction.name}</span>
                </Button>
            </div>
        </>
    )
}
