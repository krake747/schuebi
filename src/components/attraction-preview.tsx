import { Clock, Heart, MapPin, X } from "lucide-react"
import { useState } from "react"

import { beautifyLabel, hasDescription, hasPhoto, type Attraction } from "@/data/attractions"
import { cn } from "@/lib/utils"
import { AttractionIconView, getAttractionCircleColor } from "@/components/attraction-icon"
import { BottomCard } from "@/components/bottom-card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useFavourites } from "@/store/use-favourites"

type AttractionPreviewProps = {
    attraction: Attraction
    onMeetHere: (attraction: Attraction) => void
    onClose: () => void
}

export function AttractionPreview({ attraction, onMeetHere, onClose }: AttractionPreviewProps) {
    const [imageFailed, setImageFailed] = useState(false)
    const showPhoto = hasPhoto(attraction) && !imageFailed
    const favourite = useFavourites((state) => state.ids.includes(attraction.id))
    const toggleFavourite = useFavourites((state) => state.toggle)

    return (
        <BottomCard>
            <Card size="sm" className="mx-auto w-full max-w-md rounded-3xl bg-card/95 shadow-2xl backdrop-blur">
                {showPhoto && (
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
                                <Badge variant="secondary" className="text-2xs mt-1.5 h-auto rounded-full px-2 py-px">
                                    {beautifyLabel(attraction.group)}
                                </Badge>
                            )}
                        </div>
                    </div>
                    <CardAction className="flex items-center gap-1">
                        <Button
                            variant="ghost"
                            size="icon-lg"
                            className="hit-area-[2px]"
                            onClick={() => toggleFavourite(attraction.id)}
                            aria-label={favourite ? "Remove from favourites" : "Add to favourites"}
                            aria-pressed={favourite}
                        >
                            <Heart className={cn("size-4", favourite && "fill-destructive text-destructive")} />
                        </Button>
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
                <CardContent className="flex flex-col gap-4 pb-1">
                    {hasDescription(attraction) && (
                        <p className="text-sm text-muted-foreground">{attraction.description}</p>
                    )}
                    <Button className="hit-area-y-1.5 w-full" onClick={() => onMeetHere(attraction)}>
                        <MapPin className="size-4" aria-hidden />
                        Meet here
                    </Button>
                </CardContent>
            </Card>
        </BottomCard>
    )
}
