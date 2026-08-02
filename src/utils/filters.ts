import type { Attraction } from "@/data/attractions"
import { beautifyLabel, facilityCategory } from "@/data/attractions"
import { ATTRACTIONS } from "@/data/attractions-generated"

export type FilterOption = {
    key: string
    label: string
    count: number
}

export type FilterController = {
    query: string
    setQuery: (value: string) => void
    activeFilter: string | null
    setActiveFilter: (key: string | null) => void
    allFilters: FilterOption[]
}

function filterKey(attraction: Attraction): string {
    return facilityCategory(attraction.group ?? attraction.category)
}

export function buildFilters(): FilterOption[] {
    const counts = new Map<string, number>()
    for (const attraction of ATTRACTIONS) {
        const key = filterKey(attraction)
        counts.set(key, (counts.get(key) ?? 0) + 1)
    }
    return Array.from(counts.entries())
        .map(([key, count]) => ({
            key,
            label: beautifyLabel(key),
            count,
        }))
        .toSorted((a, b) => b.count - a.count)
}

export function filterAttractions(query: string, activeFilter: string | null): Attraction[] {
    const q = query.trim().toLowerCase()
    return ATTRACTIONS.filter((attraction) => {
        const matchesQuery =
            q === "" ||
            attraction.name.toLowerCase().includes(q) ||
            attraction.description.toLowerCase().includes(q) ||
            attraction.category.toLowerCase().includes(q) ||
            (attraction.group !== undefined && attraction.group.toLowerCase().includes(q))
        if (!matchesQuery) return false
        if (activeFilter === null) return true
        return filterKey(attraction) === activeFilter
    })
}
