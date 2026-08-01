import { roundCoordinate, type Basemap } from "./maps"

export function buildShareUrl(lat: number, lng: number, basemap?: Basemap): string {
    const url = new URL(window.location.origin + window.location.pathname)
    url.searchParams.set("lat", String(roundCoordinate(lat)))
    url.searchParams.set("lng", String(roundCoordinate(lng)))
    if (basemap === "satellite") {
        url.searchParams.set("basemap", "satellite")
    }
    return url.toString()
}
