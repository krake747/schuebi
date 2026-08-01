export type AttractionSource = "programme" | "osm" | "curated" | "geojson"

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

const LABEL_MAP: Record<string, string> = {
    "bar and snacks": "Bar & Snacks",
    "sales booth": "Stands",
    "games booth": "Games",
    "kids-ride": "Kids' Rides",
    "sweet snacks": "Sweet Treats",
    "candy shop": "Candy",
    ride: "Thrill Rides",
    "shooting gallery": "Shooting",
    restaurant: "Restaurants",
    "amusement arcade": "Arcades",
}

const FACILITY_LABEL_MAP: Record<string, string> = {
    "Toilet (with fee)": "Toilets",
    "Toilet (free of charge)": "Toilets",
    "Toilet (handicapped accessible)": "Toilets",
    "Diaper changing table": "Toilets",
    "Emergency care": "Info & Safety",
    Police: "Info & Safety",
}

export function facilityLabel(key: string): string {
    return FACILITY_LABEL_MAP[key] || key
}

export function beautifyLabel(key: string): string {
    return LABEL_MAP[key] || FACILITY_LABEL_MAP[key] || key
}

export function hasDescription(attraction: Attraction): boolean {
    return attraction.description !== undefined && attraction.description.length > 0
}

export function hasPhoto(attraction: Attraction): boolean {
    return attraction.photo !== undefined && attraction.categoryId < 1000
}
