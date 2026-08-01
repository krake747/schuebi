import { HeadContent, Outlet, createRootRoute } from "@tanstack/react-router"
import { MotionConfig } from "motion/react"

export const Route = createRootRoute({
    component: RootComponent,
})

function RootComponent() {
    return (
        <MotionConfig reducedMotion="user">
            <HeadContent />
            <Outlet />
        </MotionConfig>
    )
}
