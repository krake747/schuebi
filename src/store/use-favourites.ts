import { create } from "zustand"
import { persist } from "zustand/middleware"

type FavouritesState = {
    ids: string[]
    toggle: (id: string) => void
    clear: () => void
}

export const useFavourites = create<FavouritesState>()(
    persist(
        (set) => ({
            ids: [],
            toggle: (id) =>
                set((state) => ({
                    ids: state.ids.includes(id) ? state.ids.filter((current) => current !== id) : [...state.ids, id],
                })),
            clear: () => set({ ids: [] }),
        }),
        {
            name: "schuebi-favourites",
            partialize: (state) => ({ ids: state.ids }),
        },
    ),
)
