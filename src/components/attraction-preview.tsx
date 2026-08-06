import { Clock, MapPin, Navigation, Share2, Trash2, X } from "lucide-react"
import { useState } from "react"
import { motion } from "motion/react"

import { beautifyLabel, hasDescription, hasPhoto, type Attraction } from "@/data/attractions"
import { cn } from "@/lib/utils"
import { useShare } from "@/hooks/use-share"
import { googleMapsDirectionsUrl } from "@/utils/maps"
import { buildShareUrl } from "@/utils/share"
import { AttractionIconView, getAttractionCircleColor } from "@/components/attraction-icon"
import { BottomCard } from "@/components/bottom-card"
import { FavouriteButton } from "@/components/favourite-button"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export type ShareController = {
    mode: "create" | "shared"
    copied: boolean
    onShare: () => void
    onClear: () => void
}

type AttractionPreviewProps = {
    attraction: Attraction | null
    pin: { lat: number; lng: number } | null
    share: ShareController
    onMeetHere: (attraction: Attraction) => void
    onClose: () => void
}

const BODY_TRANSITION = { duration: 0.28, ease: [0.32, 0.72, 0, 1] as const }

export function AttractionPreview({ attraction, pin, share, onMeetHere, onClose }: AttractionPreviewProps) {
    const [imageFailed, setImageFailed] = useState(false)
    const { share: shareAttraction, copied } = useShare()
    const showPhoto = attraction !== null && hasPhoto(attraction) && !imageFailed

    const pinSet = pin !== null
    const showAttractionBody = attraction !== null

    return (
        <BottomCard>
            <Card size="sm" className="mx-auto w-full max-w-md rounded-3xl bg-card/95 shadow-2xl backdrop-blur">
                {showPhoto && attraction !== null && (
                    <div className="-mt-4 aspect-16/10 bg-muted">
                        <img
                            src={attraction.photo}
                            alt={attraction.name}
                            loading="lazy"
                            onError={() => setImageFailed(true)}
                            className="h-full w-full object-cover motion-safe:transition-opacity motion-safe:duration-300"
                        />
                    </div>
                )}
                {attraction !== null && (
                    <CardHeader className="gap-3">
                        <div className="flex items-start gap-3">
                            <AttractionIconView
                                attraction={attraction}
                                className={cn(
                                    "flex size-10 shrink-0 items-center justify-center rounded-full [&_svg]:size-5",
                                    getAttractionCircleColor(attraction),
                                )}
                            />
                            <div className="min-w-0 flex-1">
                                <CardDescription className="text-xs font-medium tracking-wide uppercase">
                                    {attraction.category}
                                </CardDescription>
                                <CardTitle className="text-lg leading-tight font-semibold">{attraction.name}</CardTitle>
                                {attraction.hours !== undefined && (
                                    <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                                        <Clock className="size-3.5 shrink-0" aria-hidden />
                                        {attraction.hours}
                                    </p>
                                )}
                                {attraction.group !== undefined && (
                                    <Badge
                                        variant="secondary"
                                        className="text-2xs mt-1.5 h-auto rounded-full px-2 py-px"
                                    >
                                        {beautifyLabel(attraction.group)}
                                    </Badge>
                                )}
                            </div>
                        </div>
                        <CardAction className="flex items-center gap-1">
                            <FavouriteButton
                                id={attraction.id}
                                className="hit-area-[2px] flex size-9 items-center justify-center rounded-2xl text-muted-foreground hover:bg-muted hover:text-foreground"
                            />
                            <Button
                                variant="ghost"
                                size="icon-lg"
                                className="hit-area-[2px]"
                                onClick={onClose}
                                aria-label="Close"
                            >
                                <X className="size-4" />
                            </Button>
                        </CardAction>
                    </CardHeader>
                )}
                <CardContent className="flex flex-col gap-4 pb-1">
                    {showAttractionBody && attraction !== null ? (
                        <AttractionBody
                            attraction={attraction}
                            copied={copied}
                            pinSet={pinSet}
                            onShareAttraction={() => shareAttraction(buildShareUrl(attraction.lat, attraction.lng))}
                            onMeetHere={() => onMeetHere(attraction)}
                            onClearPin={share.onClear}
                        />
                    ) : pin !== null ? (
                        <MeetingBody pin={pin} share={share} />
                    ) : null}
                </CardContent>
            </Card>
        </BottomCard>
    )
}

function AttractionBody({
    attraction,
    copied,
    pinSet,
    onShareAttraction,
    onMeetHere,
    onClearPin,
}: {
    attraction: Attraction
    copied: boolean
    pinSet: boolean
    onShareAttraction: () => void
    onMeetHere: () => void
    onClearPin: () => void
}) {
    return (
        <motion.div
            className="flex flex-col gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={BODY_TRANSITION}
        >
            {hasDescription(attraction) && <p className="text-sm text-muted-foreground">{attraction.description}</p>}
            <Button size="lg" className="hit-area-y-1 w-full" onClick={onMeetHere}>
                <MapPin className="size-4" aria-hidden />
                {pinSet ? "Pin set" : "Meet here"}
            </Button>
            <div className="grid grid-cols-2 gap-2">
                <Button
                    size="lg"
                    variant="secondary"
                    className="hit-area-y-1 w-full"
                    render={
                        <a
                            href={googleMapsDirectionsUrl(attraction.lat, attraction.lng)}
                            target="_blank"
                            rel="noopener noreferrer"
                        />
                    }
                >
                    <Navigation className="size-4" aria-hidden />
                    Direct me
                </Button>
                <Button
                    size="lg"
                    variant="secondary"
                    className="hit-area-y-1 w-full"
                    onClick={pinSet ? onClearPin : onShareAttraction}
                >
                    {pinSet ? <Trash2 className="size-4" aria-hidden /> : <Share2 className="size-4" aria-hidden />}
                    {pinSet ? "Clear pin" : copied ? "Link copied" : "Share"}
                </Button>
            </div>
        </motion.div>
    )
}

function MeetingBody({ pin, share }: { pin: { lat: number; lng: number }; share: ShareController }) {
    return (
        <motion.div
            className="flex flex-col gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={BODY_TRANSITION}
        >
            {share.mode === "shared" ? (
                <>
                    <Button
                        size="lg"
                        className="hit-area-y-1 w-full bg-emerald-500 text-white hover:bg-emerald-600"
                        render={
                            <a
                                href={googleMapsDirectionsUrl(pin.lat, pin.lng)}
                                target="_blank"
                                rel="noopener noreferrer"
                            />
                        }
                    >
                        <Navigation className="size-4" aria-hidden />
                        Navigate
                    </Button>
                    <div className="grid grid-cols-2 gap-2">
                        <Button size="lg" variant="secondary" className="hit-area-y-1 w-full" onClick={share.onShare}>
                            <Share2 className="size-4" aria-hidden />
                            <AnimatedShareLabel copied={share.copied} shareLabel="Share Again" />
                        </Button>
                        <ClearPin onClear={share.onClear} />
                    </div>
                </>
            ) : (
                <>
                    <Button size="lg" className="hit-area-y-1 w-full" onClick={share.onShare}>
                        <Share2 className="size-4" aria-hidden />
                        <AnimatedShareLabel copied={share.copied} shareLabel="Share Meeting Point" />
                    </Button>
                    <div className="grid grid-cols-2 gap-2">
                        <Button
                            size="lg"
                            variant="secondary"
                            className="hit-area-y-1 w-full"
                            render={
                                <a
                                    href={googleMapsDirectionsUrl(pin.lat, pin.lng)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                />
                            }
                        >
                            <Navigation className="size-4" aria-hidden />
                            Direct me
                        </Button>
                        <ClearPin onClear={share.onClear} />
                    </div>
                </>
            )}
        </motion.div>
    )
}

function AnimatedShareLabel({ copied, shareLabel }: { copied: boolean; shareLabel: string }) {
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
        <Button size="lg" variant="secondary" className="hit-area-y-1 w-full" onClick={onClear}>
            <Trash2 className="size-5" aria-hidden />
            Clear Pin
        </Button>
    )
}
