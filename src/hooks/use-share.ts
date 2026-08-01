import { useEffect, useRef, useState } from "react"

export function useShare() {
    const [copied, setCopied] = useState(false)
    const timeoutRef = useRef<number | null>(null)

    useEffect(() => {
        return () => {
            if (timeoutRef.current !== null) window.clearTimeout(timeoutRef.current)
        }
    }, [])

    const share = async (url: string) => {
        const shareData = {
            title: "SchueberFouer Meeting Point",
            text: "Meet me here at the Schueberfouer!",
            url,
        }

        if (navigator.share !== undefined && (navigator.canShare === undefined || navigator.canShare(shareData))) {
            try {
                await navigator.share(shareData)
                return
            } catch (error) {
                // User dismissed the native sheet — nothing to fall back to.
                if (error instanceof DOMException && error.name === "AbortError") return
            }
        }

        try {
            await navigator.clipboard.writeText(url)
            if (timeoutRef.current !== null) window.clearTimeout(timeoutRef.current)
            setCopied(true)
            timeoutRef.current = window.setTimeout(() => setCopied(false), 2000)
        } catch {
            // Clipboard unavailable — nothing more we can do.
        }
    }

    return { share, copied }
}
