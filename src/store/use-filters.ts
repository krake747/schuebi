import { create } from "zustand"

type FiltersState = {
    query: string
    selected: string[]
    open: boolean
    setQuery: (query: string) => void
    toggle: (key: string) => void
    setSelected: (keys: string[]) => void
    setOpen: (open: boolean) => void
    clear: () => void
}

export const useFilters = create<FiltersState>((set) => ({
    query: "",
    selected: [],
    open: false,
    setQuery: (query) => set({ query }),
    toggle: (key) =>
        set((state) => ({
            selected: state.selected.includes(key)
                ? state.selected.filter((current) => current !== key)
                : [...state.selected, key],
        })),
    setSelected: (keys) => set({ selected: keys }),
    setOpen: (open) => set({ open }),
    clear: () => set({ query: "", selected: [] }),
}))

export function hasActiveFilters(query: string, selected: string[]): boolean {
    return query.trim() !== "" || selected.length > 0
}
