export const GLACIS_CENTER: [number, number] = [6.1237, 49.6168]
export const INITIAL_ZOOM = 16
export const MIN_ZOOM = 14.5
export const MAX_ZOOM = 19
export const GLACIS_BOUNDS: [[number, number], [number, number]] = [
    [6.111, 49.608],
    [6.137, 49.625],
]

export const MAP_STYLE_URL = "https://vectortiles.geoportail.lu/styles/roadmap/style.json"

export function roundCoordinate(value: number): number {
    return Number(value.toFixed(6))
}

export function googleMapsDirectionsUrl(lat: number, lng: number): string {
    return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&travelmode=walking`
}
