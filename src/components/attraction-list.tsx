import { useEffect, useRef } from "react"

import { AttractionListItem } from "@/components/attraction-list-item"
import type { Attraction } from "@/data/attractions"

type AttractionListProps = {
    attractions: Attraction[]
    selection: { selectedId: string | null; onSelect: (id: string) => void }
}

export function AttractionList({ attractions, selection }: AttractionListProps) {
    const itemRefs = useRef(new Map<string, HTMLLIElement>())
    const { selectedId, onSelect } = selection

    useEffect(() => {
        if (selectedId === null) return
        const element = itemRefs.current.get(selectedId)
        element?.scrollIntoView({ behavior: "smooth", block: "nearest" })
    }, [selectedId])

    if (attractions.length === 0) {
        return (
            <div className="min-h-0 flex-1 overflow-y-auto px-3 py-2">
                <p className="py-8 text-center text-sm text-muted-foreground">No places match your search or filter.</p>
            </div>
        )
    }

    return (
        <div className="min-h-0 flex-1 overflow-y-auto px-3 py-2">
            <ul className="flex flex-col gap-1">
                {attractions.map((attraction) => (
                    <li
                        key={attraction.id}
                        ref={(el) => {
                            if (el) itemRefs.current.set(attraction.id, el)
                            else itemRefs.current.delete(attraction.id)
                        }}
                    >
                        <AttractionListItem
                            attraction={attraction}
                            active={attraction.id === selectedId}
                            onSelect={onSelect}
                        />
                    </li>
                ))}
            </ul>
        </div>
    )
}
