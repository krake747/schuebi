import { Check, XIcon } from "lucide-react"
import { useMemo } from "react"

import { Button } from "@/components/ui/button"
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
} from "@/components/ui/drawer"
import { categoryStyle } from "@/data/attractions"
import { cn } from "@/lib/utils"
import { buildFilters, filterAttractions } from "@/utils/filters"
import { useFilters } from "@/store/use-filters"

export function FilterDrawer() {
    const query = useFilters((state) => state.query)
    const selected = useFilters((state) => state.selected)
    const toggle = useFilters((state) => state.toggle)
    const clear = useFilters((state) => state.clear)
    const open = useFilters((state) => state.open)
    const setOpen = useFilters((state) => state.setOpen)
    const allFilters = useMemo(() => buildFilters(), [])
    const count = filterAttractions(query, selected).length

    return (
        <Drawer open={open} onOpenChange={setOpen} swipeDirection="right">
            <DrawerContent className="max-h-dvh">
                <DrawerClose
                    render={
                        <Button
                            variant="ghost"
                            className="hit-area-x-1 hit-area-y-1 absolute top-4 right-4"
                            size="icon-lg"
                        />
                    }
                >
                    <XIcon />
                    <span className="sr-only">Close filters</span>
                </DrawerClose>
                <DrawerHeader className="gap-1 p-4 pb-3 text-left group-data-[swipe-axis=x]/drawer-popup:text-left">
                    <DrawerTitle className="text-lg">Filters</DrawerTitle>
                    <DrawerDescription>Select as many types as you like.</DrawerDescription>
                </DrawerHeader>
                <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-4 py-3">
                    <fieldset className="flex flex-wrap gap-2">
                        <legend className="sr-only">Filter by type</legend>
                        {allFilters.map((f) => {
                            const active = selected.includes(f.key)
                            const color = categoryStyle(f.key)
                            return (
                                <button
                                    key={f.key}
                                    type="button"
                                    aria-pressed={active}
                                    onClick={() => toggle(f.key)}
                                    className={cn(
                                        "inline-flex min-w-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium transition-colors duration-150 outline-none select-none focus-visible:ring-2 focus-visible:ring-ring/70 active:scale-[0.97]",
                                        active ? color.fill : "bg-secondary text-secondary-foreground hover:bg-accent",
                                    )}
                                >
                                    <span className={cn("size-2 rounded-full", color.dot)} aria-hidden />
                                    {f.label}
                                    <span className={cn("text-2xs ml-1 opacity-60", active && "opacity-80")}>
                                        {f.count}
                                    </span>
                                    <Check className={cn("size-3", active ? "opacity-100" : "opacity-0")} aria-hidden />
                                </button>
                            )
                        })}
                    </fieldset>
                </div>
                <DrawerFooter className="gap-2 p-4 pt-2">
                    {selected.length > 0 && (
                        <Button
                            type="button"
                            variant="ghost"
                            className="h-9 w-full text-destructive hover:text-destructive"
                            onClick={clear}
                        >
                            Clear all
                        </Button>
                    )}
                    <Button type="button" className="w-full" onClick={() => setOpen(false)}>
                        Show {count} {count === 1 ? "place" : "places"}
                    </Button>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    )
}
