import { Search } from "lucide-react"

import { Input } from "@/components/ui/input"
import { groupColor } from "@/utils/colors"
import type { FilterController } from "@/utils/filters"
import { cn } from "@/lib/utils"

type SearchFilterHeaderProps = {
    filter: FilterController
}

export function SearchFilterHeader({ filter }: SearchFilterHeaderProps) {
    const { query, setQuery, allFilters, activeFilter, setActiveFilter } = filter
    return (
        <>
            <div className="relative">
                <Search
                    className="absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground"
                    aria-hidden
                />
                <Input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Search by name or type"
                    enterKeyHint="search"
                    className="pl-8"
                    aria-label="Search places"
                />
            </div>
            <div
                className="-my-3 flex gap-2 overflow-x-auto overflow-y-hidden py-3 scroll-fade-x no-scrollbar"
                role="group"
                aria-label="Filter by type"
            >
                {allFilters.map((f) => {
                    const active = f.key === activeFilter
                    const color = groupColor(f.key)
                    return (
                        <button
                            key={f.key}
                            type="button"
                            onClick={() => setActiveFilter(active ? null : f.key)}
                            aria-pressed={active}
                            className={cn(
                                "hit-area-y-3 flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium whitespace-nowrap transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring/70",
                                active
                                    ? color.fill
                                    : "bg-muted/70 text-foreground hover:bg-muted",
                            )}
                        >
                            <span
                                className={cn("size-2 rounded-full", color.dot)}
                                aria-hidden
                            />
                            {f.label}
                            <span className={cn("text-2xs ml-1 opacity-60", active && "opacity-80")}>{f.count}</span>
                        </button>
                    )
                })}
            </div>
        </>
    )
}
