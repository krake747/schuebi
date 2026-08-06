import { create } from "zustand"

import type { Attraction } from "@/data/attractions"
import { ATTRACTIONS } from "@/data/attractions-generated"

type SelectionState = {
    selectedId: string | null
    flyToId: string | null
    sheetOpen: boolean
    select: (id: string) => void
    clear: () => void
    setSheetOpen: (open: boolean) => void
}

export const useSelection = create<SelectionState>((set) => ({
    selectedId: null,
    flyToId: null,
    sheetOpen: false,
    select: (id) => set({ selectedId: id, flyToId: id }),
    clear: () => set({ selectedId: null }),
    setSheetOpen: (open) => set({ sheetOpen: open }),
}))

export function selectSelectedAttraction(state: SelectionState): Attraction | null {
    return state.selectedId === null
        ? null
        : (ATTRACTIONS.find((attraction) => attraction.id === state.selectedId) ?? null)
}
