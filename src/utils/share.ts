import { roundCoordinate } from "./maps"

export function buildShareUrl(lat: number, lng: number): string {
    const url = new URL(window.location.origin + window.location.pathname)
    url.searchParams.set("lat", String(roundCoordinate(lat)))
    url.searchParams.set("lng", String(roundCoordinate(lng)))
    return url.toString()
}
