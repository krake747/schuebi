import type { SVGProps } from "react"

type PinIconProps = SVGProps<SVGSVGElement> & {
    size?: number
}

export function PinIcon({ size = 36, "aria-hidden": ariaHidden, role, ...props }: PinIconProps) {
    return (
        <svg
            role={role ?? (ariaHidden ? undefined : "img")}
            viewBox="0 0 36 46"
            height={size}
            fill="currentColor"
            aria-hidden={ariaHidden}
            {...props}
        >
            <path d="M18 1C8.6 1 1 8.6 1 18c0 12.4 15.4 26.3 16.1 26.9a1.2 1.2 0 0 0 1.8 0C19.6 44.3 35 30.4 35 18 35 8.6 27.4 1 18 1z" />
            <circle cx="18" cy="17.5" r="7" fill="#fff" />
        </svg>
    )
}
