import { Banknote, FerrisWheel, Gamepad2, Shield, Toilet, Utensils } from "lucide-react"

import type { Attraction } from "@/data/attractions"

const iconElement: Record<number, React.JSX.Element> = {
    100: <FerrisWheel aria-hidden />,
    101: <Utensils aria-hidden />,
    102: <Gamepad2 aria-hidden />,
    1001: <Banknote aria-hidden />,
    1002: <Shield aria-hidden />,
    1003: <Shield aria-hidden />,
    1004: <Toilet aria-hidden />,
    1005: <Toilet aria-hidden />,
    1006: <Toilet aria-hidden />,
    1007: <Toilet aria-hidden />,
}

const circleClass: Record<number, string> = {
    100: "bg-primary/10 text-primary",
    101: "bg-amber-100 text-amber-600",
    102: "bg-emerald-100 text-emerald-600",
    1001: "bg-emerald-100 text-emerald-600",
    1002: "bg-red-100 text-red-600",
    1003: "bg-red-100 text-red-600",
    1004: "bg-sky-100 text-sky-600",
    1005: "bg-sky-100 text-sky-600",
    1006: "bg-sky-100 text-sky-600",
    1007: "bg-sky-100 text-sky-600",
}

type AttractionIconViewProps = {
    attraction: Attraction
    className?: string
}

export function AttractionIconView({ attraction, className }: AttractionIconViewProps) {
    const el = iconElement[attraction.categoryId] ?? <FerrisWheel aria-hidden />
    return (
        <span className={className} data-testid="attraction-icon">
            {el}
        </span>
    )
}

export function getAttractionCircleColor(attraction: Attraction): string {
    return circleClass[attraction.categoryId] ?? "bg-sky-100 text-sky-600"
}
