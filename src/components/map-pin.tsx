import { type Map as MaplibreMap, Marker } from "maplibre-gl"
import { useEffect, useEffectEvent, useRef } from "react"

const PIN_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="36" height="46" viewBox="0 0 36 46"><path d="M18 1C8.6 1 1 8.6 1 18c0 12.4 15.4 26.3 16.1 26.9a1.2 1.2 0 0 0 1.8 0C19.6 44.3 35 30.4 35 18 35 8.6 27.4 1 18 1z" fill="currentColor"/><circle cx="18" cy="17.5" r="7" fill="#fff"/></svg>`
const EASE_OUT_EXPO = "cubic-bezier(0.19, 1, 0.22, 1)"

const PIN_DROP_KEYFRAMES: Keyframe[] = [
    { offset: 0, transform: "translateY(-28px) scale(0.92)", opacity: 0 },
    { offset: 0.55, transform: "translateY(0) scale(1)", opacity: 1 },
    { offset: 0.75, transform: "translateY(-6px)" },
    { offset: 1, transform: "translateY(0)" },
]

const PIN_FADE_KEYFRAMES: Keyframe[] = [{ opacity: 0 }, { opacity: 1 }]

type MapPinProps = {
    map: MaplibreMap
    lat: number
    lng: number
}

export function MapPin({ map, lat, lng }: MapPinProps) {
    const markerRef = useRef<Marker | null>(null)
    const innerRef = useRef<HTMLDivElement | null>(null)
    const getPosition = useEffectEvent(() => ({ lat, lng }))

    useEffect(() => {
        const element = document.createElement("div")
        element.dataset.testid = "pin"
        element.style.pointerEvents = "none"
        const inner = document.createElement("div")
        inner.style.pointerEvents = "none"
        inner.style.color = "var(--color-primary)"
        inner.style.filter = "drop-shadow(0 3px 4px rgb(0 0 0 / 0.35))"
        inner.innerHTML = PIN_SVG
        element.appendChild(inner)

        const { lat: initialLat, lng: initialLng } = getPosition()
        const marker = new Marker({ element, anchor: "bottom" }).setLngLat([initialLng, initialLat]).addTo(map)
        markerRef.current = marker
        innerRef.current = inner

        return () => {
            marker.remove()
            markerRef.current = null
            innerRef.current = null
        }
    }, [map])

    useEffect(() => {
        const marker = markerRef.current
        const inner = innerRef.current
        if (marker === null || inner === null) return
        marker.setLngLat([lng, lat])

        const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
        const animation = inner.animate(reduceMotion ? PIN_FADE_KEYFRAMES : PIN_DROP_KEYFRAMES, {
            duration: reduceMotion ? 200 : 450,
            easing: reduceMotion ? "ease-out" : EASE_OUT_EXPO,
            fill: "backwards",
        })
        return () => {
            animation.cancel()
        }
    }, [map, lat, lng])

    return null
}
