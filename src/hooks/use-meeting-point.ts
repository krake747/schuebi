import { useNavigate } from "@tanstack/react-router"
import type { Map as MapLibreMap } from "maplibre-gl"
import { useMemo, useState } from "react"

import type { Attraction } from "@/data/attractions"
import { ATTRACTIONS } from "@/data/attractions-generated"
import { roundCoordinate } from "@/utils/maps"
import { buildShareUrl } from "@/utils/share"
import { filterAttractions } from "@/utils/filters"
import { hasActiveFilters, useFilters } from "@/store/use-filters"
import { useShare } from "./use-share"

export function useMeetingPoint(search: { lat: number | undefined; lng: number | undefined }, map: MapLibreMap | null) {
    const navigate = useNavigate()
    const { share, copied } = useShare()
    const pin = search.lat !== undefined && search.lng !== undefined ? { lat: search.lat, lng: search.lng } : null
    const [mode, setMode] = useState<"create" | "shared">(() => (pin === null ? "create" : "shared"))
    const [selectedId, setSelectedId] = useState<string | null>(null)
    const [flyToId, setFlyToId] = useState<string | null>(null)
    const [sheetOpen, setSheetOpen] = useState(false)

    const query = useFilters((state) => state.query)
    const selected = useFilters((state) => state.selected)
    const clearFilters = useFilters((state) => state.clear)

    const selectedAttraction =
        selectedId === null ? null : (ATTRACTIONS.find((attraction) => attraction.id === selectedId) ?? null)
    const filtered = useMemo(() => filterAttractions(query, selected), [query, selected])

    const selectAttraction = (id: string) => {
        setSelectedId(id)
        setFlyToId(id)
    }

    const clearSelection = () => setSelectedId(null)

    const setPin = (lat: number, lng: number) => {
        setSelectedId(null)
        setMode("create")
        void navigate({
            to: "/",
            search: { lat: roundCoordinate(lat), lng: roundCoordinate(lng) },
            replace: true,
        })
        map?.flyTo({ center: [lng, lat], zoom: Math.max(map.getZoom(), 16), duration: 500, essential: true })
    }

    const handleTap = (lat: number, lng: number) => setPin(lat, lng)

    const handleClear = () => {
        setMode("create")
        void navigate({ to: "/", search: {}, replace: true })
    }

    const handleShare = () => {
        if (pin === null) return
        void share(buildShareUrl(pin.lat, pin.lng))
    }

    const handleMeetHere = (attraction: Attraction) => {
        setPin(attraction.lat, attraction.lng)
        setSheetOpen(false)
    }

    return {
        pin,
        filtered,
        handleTap,
        handleMeetHere,
        share: { mode, copied, onShare: handleShare, onClear: handleClear },
        selection: { selectedId, flyToId, selected: selectedAttraction, selectAttraction, clearSelection },
        filter: { clearFilters, hasActiveFilters: hasActiveFilters(query, selected) },
        sheet: { open: sheetOpen, setOpen: setSheetOpen },
    }
}
