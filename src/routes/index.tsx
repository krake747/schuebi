import { createFileRoute } from "@tanstack/react-router"
import { FilterX, Layers, Search } from "lucide-react"

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
import { EmptyState } from "@/components/empty-state"
import { Header } from "@/components/header"
import { Map } from "@/components/map"
import { MapPin } from "@/components/map-pin"
import { SearchFilterHeader } from "@/components/search-filter-header"
import { ShareSheet } from "@/components/share-sheet"
import { SlideUpPresence } from "@/components/slide-up-presence"
import { Button } from "@/components/ui/button"
import { MapMarker, MarkerContent, MarkerTooltip, useMap } from "@/components/ui/map"
import { ATTRACTIONS } from "@/data/attractions-generated"
import { useMeetingPoint } from "@/hooks/use-meeting-point"
import { cn } from "@/lib/utils"
import { groupColor } from "@/utils/colors"
import { type Basemap } from "@/utils/maps"

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
        basemap: v.optional(v.unknown()),
    }),
    v.transform((search) => {
        const lat = toCoordinate(search.lat, 90)
        const lng = toCoordinate(search.lng, 180)
        const hasCoordinates = lat !== undefined && lng !== undefined
        return {
            lat: hasCoordinates ? lat : undefined,
            lng: hasCoordinates ? lng : undefined,
            basemap: (search.basemap === "satellite" ? "satellite" : "road") as Basemap,
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

function AttractionPin({ active, attraction }: { active: boolean; attraction: (typeof ATTRACTIONS)[number] }) {
    const color = groupColor(attraction.group ?? attraction.category).fill
    return (
        <AttractionIconView
            attraction={attraction}
            className={cn(
                "flex items-center justify-center rounded-full border-2 border-background shadow-md transition duration-150",
                active
                    ? "size-8 scale-110 bg-primary text-primary-foreground ring-2 ring-primary/30 [&_svg]:size-4"
                    : cn("size-6 text-white [&_svg]:size-3", color),
            )}
        />
    )
}

function MeetingPointPage() {
    const search = Route.useSearch()
    const basemap = search.basemap === "satellite" ? "satellite" : "road"
    const [map, setMap] = useState<MapLibreMap | null>(null)
    const meeting = useMeetingPoint(search, map)
    const { filter, selection, share, sheet, pin } = meeting

    return (
        <div className="relative h-dvh bg-muted">
            <main className="absolute inset-0 overflow-hidden">
                <Map initialCenter={meeting.pin} onTap={meeting.handleTap} onReady={setMap} basemap={basemap}>
                    {meeting.filtered.map((attraction) => (
                        <MapMarker
                            key={attraction.id}
                            position={{ lng: attraction.lng, lat: attraction.lat }}
                            onClick={() => selection.selectAttraction(attraction.id)}
                        >
                            <MarkerContent className="marker-content hit-area-2.5">
                                <AttractionPin
                                    active={attraction.id === selection.selectedId}
                                    attraction={attraction}
                                />
                            </MarkerContent>
                            <MarkerTooltip offset={18}>{attraction.name}</MarkerTooltip>
                        </MapMarker>
                    ))}
                    <FlyToSelected id={selection.flyToId} />
                </Map>
                <div className="absolute top-22 left-3 z-10 flex gap-2">
                    <Button
                        type="button"
                        variant="default"
                        size="lg"
                        className="rounded-full shadow-md"
                        onClick={() => sheet.setOpen(true)}
                    >
                        <Search className="size-4" aria-hidden />
                        Find places
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
                    type="button"
                    variant="secondary"
                    size="lg"
                    className="absolute top-22 right-3 z-10 rounded-full shadow-md"
                    onClick={meeting.toggleBasemap}
                >
                    <Layers className="size-4" aria-hidden />
                    {basemap === "road" ? "Satellite" : "Map"}
                </Button>
                <Button
                    render={
                        <a
                            href="https://github.com/krake747/schuebi"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Source code on GitHub"
                        />
                    }
                    variant="secondary"
                    size="icon"
                    className="absolute bottom-5 left-3 z-10 rounded-full shadow-md"
                >
                    <GithubIcon className="size-4" aria-hidden />
                </Button>
                {map !== null && pin !== null && <MapPin map={map} lat={pin.lat} lng={pin.lng} />}
                <AnimatePresence mode="wait">
                    {selection.selected !== null && !sheet.open ? (
                        <SlideUpPresence key="preview">
                            <AttractionPreview
                                attraction={selection.selected}
                                onMeetHere={meeting.handleMeetHere}
                                onClose={selection.clearSelection}
                            />
                        </SlideUpPresence>
                    ) : pin === null ? (
                        <SlideUpPresence key="empty">
                            <EmptyState />
                        </SlideUpPresence>
                    ) : (
                        <SlideUpPresence key="share">
                            <ShareSheet share={share} pin={pin} />
                        </SlideUpPresence>
                    )}
                </AnimatePresence>
                <AttractionsSheet
                    control={{ open: sheet.open, onOpenChange: sheet.setOpen }}
                    description={`${meeting.filtered.length} ${meeting.filtered.length === 1 ? "place" : "places"} around the Glacis`}
                    header={<SearchFilterHeader filter={filter} />}
                >
                    <AttractionList
                        attractions={meeting.filtered}
                        selection={{ selectedId: selection.selectedId, onSelect: selection.selectAttraction }}
                        onGroupFilter={filter.setActiveFilter}
                    />
                    {selection.selected !== null && (
                        <AttractionFooter attraction={selection.selected} onMeetHere={meeting.handleMeetHere} />
                    )}
                </AttractionsSheet>
                <p aria-live="polite" className="sr-only">
                    {selection.selected !== null
                        ? `${selection.selected.name} selected`
                        : pin === null
                          ? ""
                          : "Meeting point set"}
                </p>
            </main>
            <Header />
        </div>
    )
}
