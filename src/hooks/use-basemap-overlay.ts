import type { Map as MapLibreMap } from "maplibre-gl"
import { useEffect, useRef } from "react"

import { ORTHO_ATTRIBUTION, ORTHO_LAYER_ID, ORTHO_SOURCE_ID, ORTHO_TILE_URL, type Basemap } from "@/utils/maps"

export function useBasemapOverlay(map: MapLibreMap | null, basemap: Basemap) {
    const hiddenLayersRef = useRef(new Set<string>())

    useEffect(() => {
        if (map === null) return

        const applyBasemap = () => {
            if (!map.isStyleLoaded()) return
            try {
                if (basemap === "satellite") {
                    if (!map.getSource(ORTHO_SOURCE_ID)) {
                        map.addSource(ORTHO_SOURCE_ID, {
                            type: "raster",
                            tiles: [ORTHO_TILE_URL],
                            tileSize: 256,
                            attribution: ORTHO_ATTRIBUTION,
                        })
                    }
                    if (!map.getLayer(ORTHO_LAYER_ID)) {
                        const layers = map.getStyle().layers ?? []
                        const first = layers.find((layer) => layer.id !== "background")
                        map.addLayer({ id: ORTHO_LAYER_ID, type: "raster", source: ORTHO_SOURCE_ID }, first?.id)
                    }
                    hiddenLayersRef.current = new Set()
                    for (const layer of map.getStyle().layers ?? []) {
                        if (layer.id === ORTHO_LAYER_ID) continue
                        if (
                            layer.type === "background" ||
                            layer.type === "fill" ||
                            layer.type === "fill-extrusion" ||
                            layer.type === "raster"
                        ) {
                            map.setLayoutProperty(layer.id, "visibility", "none")
                            hiddenLayersRef.current.add(layer.id)
                        }
                    }
                } else {
                    if (map.getLayer(ORTHO_LAYER_ID)) map.removeLayer(ORTHO_LAYER_ID)
                    if (map.getSource(ORTHO_SOURCE_ID)) map.removeSource(ORTHO_SOURCE_ID)
                    for (const id of hiddenLayersRef.current) {
                        if (map.getLayer(id)) {
                            map.setLayoutProperty(id, "visibility", "visible")
                        }
                    }
                    hiddenLayersRef.current.clear()
                }
            } catch {
                // style may be mid-swap
            }
        }

        if (map.isStyleLoaded()) applyBasemap()
        map.on("style.load", applyBasemap)
        return () => {
            map.off("style.load", applyBasemap)
        }
    }, [map, basemap])
}
