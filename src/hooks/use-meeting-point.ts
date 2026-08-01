import { useNavigate } from "@tanstack/react-router"
import type { Map as MapLibreMap } from "maplibre-gl"
import { useMemo, useState } from "react"

import type { Attraction } from "@/data/attractions"
import { ATTRACTIONS } from "@/data/attractions-generated"
import { type Basemap, roundCoordinate } from "@/utils/maps"
import { buildShareUrl } from "@/utils/share"
import { buildFilters, filterAttractions } from "@/utils/filters"
import { useShare } from "./use-share"

export function useMeetingPoint(
    search: { lat: number | undefined; lng: number | undefined; basemap: Basemap },
    map: MapLibreMap | null,
) {
    const navigate = useNavigate()
    const { share, copied } = useShare()
    const pin = search.lat !== undefined && search.lng !== undefined ? { lat: search.lat, lng: search.lng } : null
    const [mode, setMode] = useState<"create" | "shared">(() => (pin === null ? "create" : "shared"))
    const [query, setQuery] = useState("")
    const [activeFilter, setActiveFilter] = useState<string | null>(null)
    const [selectedId, setSelectedId] = useState<string | null>(null)
    const [flyToId, setFlyToId] = useState<string | null>(null)
    const [sheetOpen, setSheetOpen] = useState(false)

    const allFilters = useMemo(buildFilters, [])

    const selected =
        selectedId === null ? null : (ATTRACTIONS.find((attraction) => attraction.id === selectedId) ?? null)
    const filtered = filterAttractions(query, activeFilter)

    const selectAttraction = (id: string) => {
        setSelectedId(id)
        setFlyToId(id)
    }

    const clearSelection = () => setSelectedId(null)

    const handleFilterChange = (next: string | null) => setActiveFilter(next)

    const clearFilters = () => {
        setQuery("")
        setActiveFilter(null)
    }

    const setPin = (lat: number, lng: number) => {
        setSelectedId(null)
        setMode("create")
        void navigate({
            to: "/",
            search: { lat: roundCoordinate(lat), lng: roundCoordinate(lng), basemap: search.basemap },
            replace: true,
        })
        map?.flyTo({ center: [lng, lat], zoom: Math.max(map.getZoom(), 16), duration: 500, essential: true })
    }

    const toggleBasemap = () => {
        const next: Basemap = search.basemap === "road" ? "satellite" : "road"
        void navigate({
            to: "/",
            search: { ...(pin === null ? {} : { lat: pin.lat, lng: pin.lng }), basemap: next },
            replace: true,
        })
    }

    const handleTap = (lat: number, lng: number) => setPin(lat, lng)

    const handleClear = () => {
        setMode("create")
        void navigate({ to: "/", search: {}, replace: true })
    }

    const handleShare = () => {
        if (pin === null) return
        void share(buildShareUrl(pin.lat, pin.lng, search.basemap))
    }

    const handleMeetHere = (attraction: Attraction) => {
        setPin(attraction.lat, attraction.lng)
        setSheetOpen(false)
    }

    return {
        pin,
        filtered,
        handleTap,
        toggleBasemap,
        handleMeetHere,
        share: { mode, copied, onShare: handleShare, onClear: handleClear },
        selection: { selectedId, flyToId, selected, selectAttraction, clearSelection },
        filter: {
            query,
            setQuery,
            activeFilter,
            setActiveFilter: handleFilterChange,
            allFilters,
            clearFilters,
            hasActiveFilters: query.trim() !== "" || activeFilter !== null,
        },
        sheet: { open: sheetOpen, setOpen: setSheetOpen },
    }
}
