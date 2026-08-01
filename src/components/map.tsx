import { type Map as MaplibreMap, type MapMouseEvent } from "maplibre-gl"
import { type ReactNode, useEffect, useEffectEvent, useState } from "react"
import { Loader2 } from "lucide-react"

import { useBasemapOverlay } from "@/hooks/use-basemap-overlay"
import {
    GLACIS_BOUNDS,
    GLACIS_CENTER,
    INITIAL_ZOOM,
    MAP_STYLE_URL,
    MAX_ZOOM,
    MIN_ZOOM,
    type Basemap,
} from "@/utils/maps"
import { Map as MapLibreMap, type MapRef } from "./ui/map"

type LatLng = {
    lat: number
    lng: number
}

type MapProps = {
    initialCenter: LatLng | null
    onTap: (lat: number, lng: number) => void
    onReady: (map: MaplibreMap) => void
    basemap?: Basemap
    children?: ReactNode
}

export function Map({ initialCenter, onTap, onReady, basemap = "road", children }: MapProps) {
    const [map, setMap] = useState<MapRef | null>(null)
    const [isLoaded, setIsLoaded] = useState(false)
    const handleTap = useEffectEvent((event: MapMouseEvent) => {
        const target = event.originalEvent.target
        if (target instanceof Element && target.closest(".maplibregl-marker") !== null) return
        onTap(event.lngLat.lat, event.lngLat.lng)
    })
    const handleReady = useEffectEvent((instance: MaplibreMap) => {
        onReady(instance)
    })
    const handleLoaded = useEffectEvent(() => {
        setIsLoaded(true)
    })

    useEffect(() => {
        if (map === null) return
        map.on("click", handleTap)
        map.on("style.load", handleLoaded)
        queueMicrotask(() => handleReady(map))
        return () => {
            map.off("click", handleTap)
            map.off("style.load", handleLoaded)
        }
    }, [map])

    useBasemapOverlay(map, basemap)

    return (
        <div className="relative h-full">
            <MapLibreMap
                ref={setMap}
                styles={{ light: MAP_STYLE_URL, dark: MAP_STYLE_URL }}
                center={initialCenter === null ? GLACIS_CENTER : [initialCenter.lng, initialCenter.lat]}
                zoom={INITIAL_ZOOM}
                minZoom={MIN_ZOOM}
                maxZoom={MAX_ZOOM}
                maxBounds={GLACIS_BOUNDS}
                attributionControl={{ compact: true }}
                dragRotate={false}
                pitchWithRotate={false}
                touchPitch={false}
            >
                {children}
            </MapLibreMap>
            {!isLoaded && (
                <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center bg-muted">
                    <Loader2 className="size-6 animate-spin text-muted-foreground" aria-label="Loading map" />
                </div>
            )}
        </div>
    )
}
