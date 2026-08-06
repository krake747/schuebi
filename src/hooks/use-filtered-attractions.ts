import { useMemo } from "react"

import type { Attraction } from "@/data/attractions"
import { useFavourites } from "@/store/use-favourites"
import { useFilters } from "@/store/use-filters"
import { filterAttractions } from "@/utils/filters"

export function useFilteredAttractions(): Attraction[] {
    const query = useFilters((state) => state.query)
    const selected = useFilters((state) => state.selected)
    const favouriteIds = useFavourites((state) => state.ids)
    return useMemo(() => filterAttractions(query, selected, new Set(favouriteIds)), [query, selected, favouriteIds])
}
