import { Clock, Navigation, Share2, Trash2, X } from "lucide-react"
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

type AttractionPreviewProps = {
    attraction: Attraction | null
    pin: { lat: number; lng: number } | null
    onClose: () => void
    onClearPin: () => void
}

const BODY_TRANSITION = { duration: 0.28, ease: [0.32, 0.72, 0, 1] as const }

function ActionButtons({ target, onClearPin }: { target: { lat: number; lng: number }; onClearPin?: () => void }) {
    const { share, copied } = useShare()
    return (
        <div className="flex items-stretch gap-2">
            <Button
                size="lg"
                variant="secondary"
                className="hit-area-y-1 flex-1"
                nativeButton={false}
                render={
                    <a
                        href={googleMapsDirectionsUrl(target.lat, target.lng)}
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
                className="hit-area-y-1 flex-1"
                onClick={() => share(buildShareUrl(target.lat, target.lng))}
            >
                <Share2 className="size-4" aria-hidden />
                {copied ? "Link copied" : "Share"}
            </Button>
            {onClearPin !== undefined && (
                <Button
                    size="icon-lg"
                    variant="ghost"
                    className="hit-area-y-1"
                    onClick={onClearPin}
                    aria-label="Clear pin"
                >
                    <Trash2 className="size-4" aria-hidden />
                </Button>
            )}
        </div>
    )
}

export function AttractionPreview({ attraction, pin, onClose, onClearPin }: AttractionPreviewProps) {
    const [imageFailed, setImageFailed] = useState(false)
    const showPhoto = attraction !== null && hasPhoto(attraction) && !imageFailed

    const target = pin ?? (attraction !== null ? { lat: attraction.lat, lng: attraction.lng } : null)

    return (
        <BottomCard className="pointer-events-none">
            <Card
                size="sm"
                className="pointer-events-auto mx-auto w-full max-w-md rounded-3xl bg-card/95 shadow-2xl backdrop-blur"
            >
                {showPhoto && attraction !== null && (
                    <div className="-mt-4 aspect-4/3 max-h-70 bg-muted">
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
                    {attraction !== null && hasDescription(attraction) && (
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={BODY_TRANSITION}
                            className="text-sm text-muted-foreground"
                        >
                            {attraction.description}
                        </motion.p>
                    )}
                    {target !== null && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={BODY_TRANSITION}>
                            {pin !== null ? (
                                <ActionButtons target={target} onClearPin={onClearPin} />
                            ) : (
                                <ActionButtons target={target} />
                            )}
                        </motion.div>
                    )}
                </CardContent>
            </Card>
        </BottomCard>
    )
}
