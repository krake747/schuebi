export type AttractionSource = "geojson"

export type Attraction = {
    id: string
    name: string
    category: string
    categoryId: number
    description: string
    hours?: string
    lat: number
    lng: number
    source: AttractionSource
    standNo?: string
    photo?: string
    group?: string
}

type CategoryStyle = {
    label: string
    dot: string
    fill: string
}

const CATEGORY_STYLE: Record<string, CategoryStyle> = {
    "sales booth": { label: "Stands", dot: "bg-sky-500", fill: "bg-sky-500 text-white" },
    "games booth": { label: "Games", dot: "bg-sky-500", fill: "bg-sky-500 text-white" },
    "shooting gallery": { label: "Shooting", dot: "bg-sky-500", fill: "bg-sky-500 text-white" },
    "amusement arcade": { label: "Arcades", dot: "bg-sky-500", fill: "bg-sky-500 text-white" },
    "candy shop": { label: "Candy", dot: "bg-amber-500", fill: "bg-amber-500 text-white" },
    "sweet snacks": { label: "Sweet Treats", dot: "bg-amber-500", fill: "bg-amber-500 text-white" },
    "bar and snacks": {
        label: "Bar & Snacks",
        dot: "bg-emerald-500",
        fill: "bg-emerald-500 text-white",
    },
    restaurant: { label: "Restaurants", dot: "bg-emerald-500", fill: "bg-emerald-500 text-white" },
    "kids-ride": { label: "Kids' Rides", dot: "bg-rose-500", fill: "bg-rose-500 text-white" },
    ride: { label: "Thrill Rides", dot: "bg-rose-500", fill: "bg-rose-500 text-white" },
    Toilets: { label: "Toilets", dot: "bg-violet-500", fill: "bg-violet-500 text-white" },
    ATM: { label: "ATM", dot: "bg-violet-500", fill: "bg-violet-500 text-white" },
    "Info & Safety": {
        label: "Info & Safety",
        dot: "bg-violet-500",
        fill: "bg-violet-500 text-white",
    },
}

const FALLBACK_STYLE: CategoryStyle = {
    label: "",
    dot: "bg-primary",
    fill: "bg-primary text-primary-foreground",
}

const FACILITY_CATEGORY: Record<string, string> = {
    "Toilet (with fee)": "Toilets",
    "Toilet (free of charge)": "Toilets",
    "Toilet (handicapped accessible)": "Toilets",
    "Diaper changing table": "Toilets",
    "Emergency care": "Info & Safety",
    Police: "Info & Safety",
}

export function facilityCategory(key: string): string {
    return FACILITY_CATEGORY[key] ?? key
}

export function beautifyLabel(key: string): string {
    return CATEGORY_STYLE[key]?.label ?? key
}

export function categoryStyle(key: string): CategoryStyle {
    return CATEGORY_STYLE[key] ?? FALLBACK_STYLE
}

export function hasDescription(attraction: Attraction): boolean {
    return attraction.description !== undefined && attraction.description.length > 0
}

export function hasPhoto(attraction: Attraction): boolean {
    return attraction.photo !== undefined && attraction.categoryId < 1000
}
