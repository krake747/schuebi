import { createFileRoute } from "@tanstack/react-router"
import { FilterX, Heart, Search, SlidersHorizontal } from "lucide-react"

import { GithubIcon } from "@/components/github-icon"
import type { Map as MapLibreMap } from "maplibre-gl"
import { useEffect, useState } from "react"
import { AnimatePresence } from "motion/react"
import * as v from "valibot"

import { AttractionFooter } from "@/components/attraction-footer"
import { AttractionIconView } from "@/components/attraction-icon"
import { AttractionList } from "@/components/attraction-list"
import { AttractionsSheet } from "@/components/attractions-sheet"
import { AttractionPreview } from "@/components/attraction-preview"
import { AttractionSearch } from "@/components/attraction-search"
import { EmptyState } from "@/components/empty-state"
import { FilterDrawer } from "@/components/filter-drawer"
import { Header } from "@/components/header"
import { Map } from "@/components/map"
import { MapPin } from "@/components/map-pin"
import { SlideUpPresence } from "@/components/slide-up-presence"
import { Button } from "@/components/ui/button"
import { MapMarker, MarkerContent, MarkerTooltip, useMap } from "@/components/ui/map"
import { ATTRACTIONS } from "@/data/attractions-generated"
import { useFilteredAttractions } from "@/hooks/use-filtered-attractions"
import { useMeetingPoint } from "@/hooks/use-meeting-point"
import { cn } from "@/lib/utils"
import { categoryStyle, facilityCategory, isFacility } from "@/data/attractions"
import { pickRandom } from "@/utils/random"
import { useFilters } from "@/store/use-filters"
import { selectSelectedAttraction, useSelection } from "@/store/use-selection"
import { useFavourites } from "@/store/use-favourites"

function toCoordinate(value: unknown, max: number): number | undefined {
    if (typeof value === "string") {
        if (value.trim() === "") return undefined
        const number = Number(value)
        return Number.isFinite(number) && Math.abs(number) <= max ? number : undefined
    }
    if (typeof value === "number") {
        return Number.isFinite(value) && Math.abs(value) <= max ? value : undefined
    }
    return undefined
}

const meetingSearchSchema = v.pipe(
    v.object({
        lat: v.optional(v.unknown()),
        lng: v.optional(v.unknown()),
    }),
    v.transform((search) => {
        const lat = toCoordinate(search.lat, 90)
        const lng = toCoordinate(search.lng, 180)
        const hasCoordinates = lat !== undefined && lng !== undefined
        return {
            lat: hasCoordinates ? lat : undefined,
            lng: hasCoordinates ? lng : undefined,
        }
    }),
)

export const Route = createFileRoute("/")({
    validateSearch: meetingSearchSchema,
    head: () => ({ meta: [{ title: "Schuebi" }] }),
    component: MeetingPointPage,
})

function FlyToSelected({ id }: { id: string | null }) {
    const { map } = useMap()

    useEffect(() => {
        if (map === null || id === null) return
        const attraction = ATTRACTIONS.find((attraction) => attraction.id === id)
        if (attraction === undefined) return
        map.flyTo({ center: [attraction.lng, attraction.lat], zoom: 17, duration: 800, essential: true })
    }, [map, id])

    return null
}

function AttractionPin({
    active,
    attraction,
    favourited,
}: {
    active: boolean
    attraction: (typeof ATTRACTIONS)[number]
    favourited: boolean
}) {
    const color = categoryStyle(facilityCategory(attraction.group ?? attraction.category)).fill
    return (
        <span className="relative">
            <AttractionIconView
                attraction={attraction}
                className={cn(
                    "flex items-center justify-center rounded-full border-2 border-background shadow-md transition duration-150",
                    active
                        ? "size-8 scale-110 bg-primary text-primary-foreground ring-2 ring-primary/30 [&_svg]:size-4"
                        : cn("size-6 text-white [&_svg]:size-3", color),
                )}
            />
            {favourited && (
                <span
                    aria-hidden
                    className={cn(
                        "absolute flex items-center justify-center rounded-full bg-rose-500 text-white ring-1 ring-background",
                        active
                            ? "-top-1.5 -right-1.5 size-3.5 [&_svg]:size-2.5"
                            : "-top-1 -right-1 size-3 [&_svg]:size-2",
                    )}
                >
                    <Heart className="fill-current" />
                </span>
            )}
        </span>
    )
}

function MeetingPointPage() {
    const search = Route.useSearch()
    const [map, setMap] = useState<MapLibreMap | null>(null)
    const meeting = useMeetingPoint(search, map)
    const { filter, pin } = meeting
    const selected = useSelection(selectSelectedAttraction)
    const selectedId = useSelection((state) => state.selectedId)
    const flyToId = useSelection((state) => state.flyToId)
    const sheetOpen = useSelection((state) => state.sheetOpen)
    const selectAttraction = useSelection((state) => state.select)
    const clearSelection = useSelection((state) => state.clear)
    const setSheetOpen = useSelection((state) => state.setSheetOpen)
    const filtered = useFilteredAttractions()
    const open = useFilters((state) => state.open)
    const setFiltersOpen = useFilters((state) => state.setOpen)
    const favouriteIds = new Set(useFavourites((state) => state.ids))
    const surprising = filtered.filter((attraction) => !isFacility(attraction))

    return (
        <div className="relative h-dvh bg-muted">
            <main className="absolute inset-0 overflow-hidden">
                <Map initialCenter={meeting.pin} onTap={meeting.handleTap} onReady={setMap}>
                    {filtered.map((attraction) => (
                        <MapMarker
                            key={attraction.id}
                            position={{ lng: attraction.lng, lat: attraction.lat }}
                            onClick={() => {
                                selectAttraction(attraction.id)
                                meeting.handleMeetHere(attraction)
                            }}
                        >
                            <MarkerContent className="marker-content hit-area-2.5">
                                <AttractionPin
                                    active={attraction.id === selectedId}
                                    attraction={attraction}
                                    favourited={favouriteIds.has(attraction.id)}
                                />
                            </MarkerContent>
                            <MarkerTooltip offset={18}>{attraction.name}</MarkerTooltip>
                        </MapMarker>
                    ))}
                    <FlyToSelected id={flyToId} />
                </Map>
                <div className="absolute top-20 left-3 z-10 flex items-center gap-2 [@media(min-height:600px)]:top-22">
                    <Button
                        type="button"
                        variant="default"
                        size="lg"
                        className="rounded-full shadow-md"
                        onClick={() => setSheetOpen(true)}
                    >
                        <Search className="size-4" aria-hidden />
                        Find places
                    </Button>
                    <Button
                        type="button"
                        variant="secondary"
                        size="icon-lg"
                        aria-label="Filters"
                        aria-pressed={open}
                        className="rounded-full shadow-md"
                        onClick={() => setFiltersOpen(true)}
                    >
                        <SlidersHorizontal className="size-4" aria-hidden />
                    </Button>
                    {filter.hasActiveFilters && (
                        <Button
                            type="button"
                            variant="secondary"
                            size="icon-lg"
                            aria-label="Clear filters"
                            className="rounded-full text-destructive shadow-md hover:text-destructive"
                            onClick={filter.clearFilters}
                        >
                            <FilterX className="size-4" aria-hidden />
                        </Button>
                    )}
                </div>
                <Button
                    render={
                        <a
                            href="https://github.com/krake747/schuebi"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Source code on GitHub"
                        />
                    }
                    nativeButton={false}
                    variant="secondary"
                    size="icon"
                    className="absolute bottom-5 left-3 z-10 rounded-full shadow-md"
                >
                    <GithubIcon className="size-4" aria-hidden />
                </Button>
                {map !== null && pin !== null && <MapPin map={map} lat={pin.lat} lng={pin.lng} />}
                <AnimatePresence mode="wait">
                    {!sheetOpen && (selected !== null || pin !== null) ? (
                        <SlideUpPresence key="card">
                            <AttractionPreview
                                attraction={selected}
                                pin={pin}
                                onClose={clearSelection}
                                onClearPin={meeting.handleClearPin}
                            />
                        </SlideUpPresence>
                    ) : !sheetOpen ? (
                        <SlideUpPresence key="empty">
                            <EmptyState
                                disabled={surprising.length === 0}
                                onSurprise={() => {
                                    const pick = pickRandom(surprising)
                                    if (pick) selectAttraction(pick.id)
                                }}
                            />
                        </SlideUpPresence>
                    ) : null}
                </AnimatePresence>
                <AttractionsSheet
                    control={{ open: sheetOpen, onOpenChange: setSheetOpen }}
                    description={`${filtered.length} ${filtered.length === 1 ? "place" : "places"} around the Glacis`}
                    header={<AttractionSearch />}
                >
                    <AttractionList attractions={filtered} />
                    {selected !== null && (
                        <AttractionFooter attraction={selected} onMeetHere={meeting.handleMeetHere} />
                    )}
                </AttractionsSheet>
                <FilterDrawer />
                <p aria-live="polite" className="sr-only">
                    {selected !== null ? `${selected.name} selected` : pin === null ? "" : "Meeting point set"}
                </p>
            </main>
            <Header />
        </div>
    )
}
