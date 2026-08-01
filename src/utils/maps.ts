export const GLACIS_CENTER: [number, number] = [6.1237, 49.6168]
export const INITIAL_ZOOM = 16
export const MIN_ZOOM = 14.5
export const MAX_ZOOM = 19
export const GLACIS_BOUNDS: [[number, number], [number, number]] = [
    [6.111, 49.608],
    [6.137, 49.625],
]

export const MAP_STYLE_URL = "https://vectortiles.geoportail.lu/styles/roadmap/style.json"

// Official Luxembourg orthophoto 2025 (10 cm GSD, CC0) via the geoportail WMTS.
// Served as standard Web-Mercator slippy tiles (z0–19), so it plugs straight
// into a MapLibre raster source. Imagery only — labels come from the roadmap
// style layered on top.
export const ORTHO_TILE_URL =
    "https://wmts1.geoportail.lu/opendata/wmts/ortho_2025/GLOBAL_WEBMERCATOR_4_V3/{z}/{x}/{y}.jpeg"
export const ORTHO_SOURCE_ID = "ortho-2025"
export const ORTHO_LAYER_ID = "ortho-2025-layer"
export const ORTHO_ATTRIBUTION = "Orthophoto 2025 © ACT Luxembourg"

export type Basemap = "road" | "satellite"

export function roundCoordinate(value: number): number {
    return Number(value.toFixed(6))
}

export function googleMapsDirectionsUrl(lat: number, lng: number): string {
    return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&travelmode=walking`
}
