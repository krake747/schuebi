import { Search } from "lucide-react"

import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"
import { useFilters } from "@/store/use-filters"

export function AttractionSearch() {
    const query = useFilters((state) => state.query)
    const setQuery = useFilters((state) => state.setQuery)
    return (
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
    )
}
