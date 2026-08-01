import { motion } from "motion/react"
import { type ReactNode } from "react"

const TRANSITION = { duration: 0.35, ease: [0.32, 0.72, 0, 1] as const }

export function SlideUpPresence({ children }: { children: ReactNode }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: "60%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "60%" }}
            transition={TRANSITION}
        >
            {children}
        </motion.div>
    )
}
