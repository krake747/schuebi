import { Search } from "lucide-react"
import type { WheelEvent } from "react"

import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { categoryStyle } from "@/data/attractions"
import type { FilterController } from "@/utils/filters"
import { cn } from "@/lib/utils"

type SearchFilterHeaderProps = {
    filter: FilterController
}

function translateWheelToScroll(event: WheelEvent<HTMLDivElement>) {
    const element = event.currentTarget
    const maxScroll = element.scrollWidth - element.clientWidth
    if (maxScroll <= 0 || event.deltaY === 0) return
    const next = element.scrollLeft + event.deltaY
    if (next > 0 && next < maxScroll) {
        event.preventDefault()
        element.scrollLeft = next
    }
}

export function SearchFilterHeader({ filter }: SearchFilterHeaderProps) {
    const { query, setQuery, allFilters, activeFilter, setActiveFilter } = filter
    return (
        <>
            <InputGroup>
                <InputGroupAddon align="inline-start">
                    <Search aria-hidden />
                </InputGroupAddon>
                <InputGroupInput
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Search by name or type"
                    enterKeyHint="search"
                    aria-label="Search places"
                />
            </InputGroup>
            <div
                onWheel={translateWheelToScroll}
                className="-my-3 flex thin-scrollbar scroll-fade-x overflow-x-auto overflow-y-hidden py-3 max-sm:no-scrollbar"
            >
                <ToggleGroup
                    value={activeFilter === null ? [] : [activeFilter]}
                    onValueChange={(next) => setActiveFilter(next[0] ?? null)}
                    aria-label="Filter by type"
                    className="w-max gap-2"
                >
                    {allFilters.map((f) => {
                        const active = f.key === activeFilter
                        const color = categoryStyle(f.key)
                        return (
                            <ToggleGroupItem
                                key={f.key}
                                value={f.key}
                                className={cn(
                                    "h-auto min-w-0 gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium transition-colors duration-150 outline-none select-none focus-visible:ring-2 focus-visible:ring-ring/70 active:scale-[0.97]",
                                    active ? color.fill : "bg-secondary text-secondary-foreground hover:bg-accent",
                                )}
                            >
                                <span className={cn("size-2 rounded-full", color.dot)} aria-hidden />
                                {f.label}
                                <span className={cn("text-2xs ml-1 opacity-60", active && "opacity-80")}>
                                    {f.count}
                                </span>
                            </ToggleGroupItem>
                        )
                    })}
                </ToggleGroup>
            </div>
        </>
    )
}
