import { useState } from "react"
import { Heart } from "lucide-react"

import { beautifyLabel, hasDescription, hasPhoto, type Attraction } from "@/data/attractions"
import { cn } from "@/lib/utils"
import { AttractionIconView, getAttractionCircleColor } from "@/components/attraction-icon"
import { Badge } from "@/components/ui/badge"
import { useFilters } from "@/store/use-filters"
import { useFavourites } from "@/store/use-favourites"

type AttractionListItemProps = {
    attraction: Attraction
    active: boolean
    onSelect: (id: string) => void
}

export function AttractionListItem({ attraction, active, onSelect }: AttractionListItemProps) {
    const toggle = useFilters((state) => state.toggle)
    const favourite = useFavourites((state) => state.ids.includes(attraction.id))
    const toggleFavourite = useFavourites((state) => state.toggle)
    return (
        <div className={cn("flex w-full items-start gap-3 rounded-xl p-2 transition-colors", active && "bg-accent")}>
            <button
                type="button"
                onClick={() => onSelect(attraction.id)}
                aria-current={active}
                className="flex min-w-0 flex-1 items-start gap-3 rounded-lg text-left outline-none hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring/70"
            >
                <AttractionThumbnail attraction={attraction} />
                <span className="min-w-0 flex-1 py-0.5">
                    <span className="block truncate text-sm font-medium">{attraction.name}</span>
                    {hasDescription(attraction) && (
                        <span className="mt-0.5 line-clamp-2 block text-xs text-muted-foreground">
                            {attraction.description}
                        </span>
                    )}
                    {attraction.group !== undefined && (
                        <Badge
                            variant="ghost"
                            role="button"
                            tabIndex={0}
                            onClick={(e) => {
                                e.stopPropagation()
                                toggle(attraction.group!)
                            }}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" || e.key === " ") {
                                    e.preventDefault()
                                    e.stopPropagation()
                                    toggle(attraction.group!)
                                }
                            }}
                            className={cn(
                                "text-2xs hit-area-3 mt-0.5 h-auto cursor-pointer rounded-full px-2 py-px font-medium transition-colors duration-150 select-none focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ring active:scale-[0.97]",
                                "bg-secondary text-secondary-foreground hover:bg-accent hover:text-accent-foreground",
                            )}
                            aria-label={`Filter by ${beautifyLabel(attraction.group)}`}
                        >
                            {beautifyLabel(attraction.group)}
                        </Badge>
                    )}
                </span>
            </button>
            <button
                type="button"
                aria-label={favourite ? "Remove from favourites" : "Add to favourites"}
                aria-pressed={favourite}
                onClick={() => toggleFavourite(attraction.id)}
                className="hit-area-3 flex shrink-0 items-center justify-center self-center rounded-full p-1.5 text-muted-foreground transition-colors duration-150 outline-none select-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/70 active:scale-95"
            >
                <Heart className={cn("size-5", favourite && "fill-destructive text-destructive")} aria-hidden />
            </button>
        </div>
    )
}

function AttractionThumbnail({ attraction }: { attraction: Attraction }) {
    const [failed, setFailed] = useState(false)
    const showPhoto = hasPhoto(attraction) && !failed

    if (!showPhoto) {
        return (
            <AttractionIconView
                attraction={attraction}
                className={cn(
                    "mt-0.5 flex size-12 shrink-0 items-center justify-center rounded-xl [&_svg]:size-5",
                    getAttractionCircleColor(attraction),
                )}
            />
        )
    }

    return (
        <span className="mt-0.5 size-12 shrink-0 overflow-hidden rounded-xl bg-muted">
            <img
                src={attraction.photo}
                alt={attraction.name}
                loading="lazy"
                onError={() => setFailed(true)}
                className="size-12 object-cover motion-safe:transition-opacity motion-safe:duration-300"
            />
        </span>
    )
}
