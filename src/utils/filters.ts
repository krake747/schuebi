import type { Attraction } from "@/data/attractions"
import { beautifyLabel, facilityCategory } from "@/data/attractions"
import { ATTRACTIONS } from "@/data/attractions-generated"
import * as R from "remeda"

export type FilterOption = {
    key: string
    label: string
    count: number
}

function filterKey(attraction: Attraction): string {
    return facilityCategory(attraction.group ?? attraction.category)
}

export function buildFilters(): FilterOption[] {
    return R.pipe(
        ATTRACTIONS,
        R.countBy(filterKey),
        R.entries(),
        R.map(([key, count]) => ({ key, label: beautifyLabel(key), count: count ?? 0 })),
        R.sortBy([R.prop("count"), "desc"]),
    )
}

export const FAVOURITES_KEY = "__favourites__"

export function filterAttractions(
    query: string,
    activeFilters: readonly string[],
    favouriteIds: ReadonlySet<string> = new Set(),
): Attraction[] {
    const q = query.trim().toLowerCase()
    const favouritesActive = activeFilters.includes(FAVOURITES_KEY)
    const categories = activeFilters.filter((key) => key !== FAVOURITES_KEY)
    const nothingActive = !favouritesActive && categories.length === 0
    return ATTRACTIONS.filter((attraction) => {
        const matchesQuery =
            q === "" ||
            attraction.name.toLowerCase().includes(q) ||
            attraction.description.toLowerCase().includes(q) ||
            attraction.category.toLowerCase().includes(q) ||
            (attraction.group !== undefined && attraction.group.toLowerCase().includes(q))
        if (!matchesQuery) return false
        if (nothingActive) return true
        const matchesFavourites = favouritesActive && favouriteIds.has(attraction.id)
        const matchesCategories = categories.length > 0 && categories.includes(filterKey(attraction))
        return matchesFavourites || matchesCategories
    })
}
