import { useNavigate } from "@tanstack/react-router"
import type { Map as MapLibreMap } from "maplibre-gl"
import { useState } from "react"

import type { Attraction } from "@/data/attractions"
import { roundCoordinate } from "@/utils/maps"
import { buildShareUrl } from "@/utils/share"
import { hasActiveFilters, useFilters } from "@/store/use-filters"
import { useSelection } from "@/store/use-selection"
import { useShare } from "./use-share"

export function useMeetingPoint(search: { lat: number | undefined; lng: number | undefined }, map: MapLibreMap | null) {
    const navigate = useNavigate()
    const { share, copied } = useShare()
    const pin = search.lat !== undefined && search.lng !== undefined ? { lat: search.lat, lng: search.lng } : null
    const [mode, setMode] = useState<"create" | "shared">(() => (pin === null ? "create" : "shared"))
    const setSheetOpen = useSelection((state) => state.setSheetOpen)
    const clearSelection = useSelection((state) => state.clear)
    const clearFilters = useFilters((state) => state.clear)
    const query = useFilters((state) => state.query)
    const selected = useFilters((state) => state.selected)

    const setPin = (lat: number, lng: number) => {
        clearSelection()
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
        handleTap,
        handleMeetHere,
        share: { mode, copied, onShare: handleShare, onClear: handleClear },
        filter: { clearFilters, hasActiveFilters: hasActiveFilters(query, selected) },
    }
}