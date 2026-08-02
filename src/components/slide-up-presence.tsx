import { motion } from "motion/react"
import { type ReactNode } from "react"

const ENTER_TRANSITION = { duration: 0.35, ease: [0.32, 0.72, 0, 1] as const }
const EXIT_TRANSITION = { duration: 0.28, ease: [0.55, 0, 1, 0.45] as const }

export function SlideUpPresence({ children }: { children: ReactNode }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: "60%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "60%", transition: EXIT_TRANSITION }}
            transition={ENTER_TRANSITION}
        >
            {children}
        </motion.div>
    )
}
