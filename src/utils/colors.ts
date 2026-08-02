const GROUP_COLORS: Record<string, { dot: string; fill: string }> = {
    "sales booth": { dot: "bg-sky-500", fill: "bg-sky-500 text-white hover:bg-sky-600" },
    "games booth": { dot: "bg-sky-500", fill: "bg-sky-500 text-white hover:bg-sky-600" },
    "shooting gallery": { dot: "bg-sky-500", fill: "bg-sky-500 text-white hover:bg-sky-600" },
    "amusement arcade": { dot: "bg-sky-500", fill: "bg-sky-500 text-white hover:bg-sky-600" },
    "candy shop": { dot: "bg-amber-500", fill: "bg-amber-500 text-white hover:bg-amber-600" },
    "sweet snacks": { dot: "bg-amber-500", fill: "bg-amber-500 text-white hover:bg-amber-600" },
    "bar and snacks": { dot: "bg-emerald-500", fill: "bg-emerald-500 text-white hover:bg-emerald-600" },
    restaurant: { dot: "bg-emerald-500", fill: "bg-emerald-500 text-white hover:bg-emerald-600" },
    "kids-ride": { dot: "bg-rose-500", fill: "bg-rose-500 text-white hover:bg-rose-600" },
    ride: { dot: "bg-rose-500", fill: "bg-rose-500 text-white hover:bg-rose-600" },
    Toilets: { dot: "bg-violet-500", fill: "bg-violet-500 text-white hover:bg-violet-600" },
    ATM: { dot: "bg-violet-500", fill: "bg-violet-500 text-white hover:bg-violet-600" },
    "Info & Safety": { dot: "bg-violet-500", fill: "bg-violet-500 text-white hover:bg-violet-600" },
}

const FALLBACK_COLOR = { dot: "bg-primary", fill: "bg-primary text-primary-foreground hover:bg-primary/80" }

export function groupColor(key: string): { dot: string; fill: string } {
    return GROUP_COLORS[key] ?? FALLBACK_COLOR
}
