import { RouterProvider, createRouter } from "@tanstack/react-router"
import { page } from "vitest/browser"
import { createRoot, type Root } from "react-dom/client"
import { afterEach, expect, test } from "vitest"

import { routeTree } from "@/routeTree.gen"

import "@/index.css"

let root: Root | null = null

function mountApp(url: string) {
    window.history.replaceState({}, "", url)
    const container = document.createElement("div")
    container.id = "root"
    document.body.replaceChildren(container)

    const router = createRouter({ routeTree })
    root = createRoot(container)
    root.render(<RouterProvider router={router} />)
}

afterEach(() => {
    root?.unmount()
    root = null
})

test("shows header, empty state and a visible map canvas", async () => {
    mountApp("/")

    await expect.element(page.getByText("Schuebi")).toBeVisible()
    await expect.element(page.getByText(/Tap the map to set a meeting point/)).toBeVisible()
    await expect.poll(() => document.querySelector(".maplibregl-canvas")).not.toBeNull()
})

test("restores a pin from shared URL params", async () => {
    mountApp("/?lat=49.6168&lng=6.1237")

    await expect.element(page.getByText("Navigate")).toBeVisible()
    await expect.element(page.getByText("Share Again")).toBeVisible()
    await expect.poll(() => document.querySelector('[data-testid="pin"]')).not.toBeNull()
})

test("finds a place in the sheet and sets it as the meeting point", async () => {
    mountApp("/")

    await page.getByRole("button", { name: /Find places/ }).click()
    await expect.element(page.getByRole("dialog")).toBeVisible()
    await expect.poll(() => page.getByRole("listitem").all().length).toBeGreaterThan(0)

    const search = page.getByRole("textbox", { name: "Search places" })
    await search.fill("ATM")
    await expect.poll(() => page.getByRole("listitem").all().length).toBeLessThanOrEqual(5)

    await page.getByRole("listitem").first().click()
    await page.getByRole("button", { name: /Meet here at/ }).click()

    await expect.element(page.getByText("Share Meeting Point")).toBeVisible()
    await expect.poll(() => document.querySelector('[data-testid="pin"]')).not.toBeNull()
})

test("tapping a pin on the map opens the preview card", async () => {
    mountApp("/")

    await expect.poll(() => document.querySelectorAll(".maplibregl-marker").length).toBeGreaterThan(0)
    const firstMarker = document.querySelector(".maplibregl-marker") as HTMLElement
    firstMarker.click()

    await expect.element(page.getByRole("button", { name: "Meet here" })).toBeVisible()
})

test("tapping the map canvas sets a meeting point", async () => {
    mountApp("/")

    await expect.poll(() => document.querySelector(".maplibregl-canvas")).not.toBeNull()
    const canvas = document.querySelector(".maplibregl-canvas") as HTMLElement
    canvas.click()

    await expect.element(page.getByText("Share Meeting Point")).toBeVisible()
    await expect.poll(() => document.querySelector('[data-testid="pin"]')).not.toBeNull()
})

test("shows a preview card for a selected attraction and meets there", async () => {
    mountApp("/")

    await page.getByRole("button", { name: /Find places/ }).click()
    await expect.poll(() => page.getByRole("listitem").all().length).toBeGreaterThan(0)
    await page.getByRole("listitem").first().click()
    await page.getByRole("button", { name: /Close/ }).click()

    await expect.element(page.getByRole("button", { name: "Meet here" })).toBeVisible()
    await page.getByRole("button", { name: "Meet here" }).click()

    await expect.element(page.getByText("Share Meeting Point")).toBeVisible()
    await expect.poll(() => document.querySelector('[data-testid="pin"]')).not.toBeNull()
})

test("clear filters button resets the map to all attractions", async () => {
    mountApp("/")

    await expect.poll(() => document.querySelectorAll(".maplibregl-marker").length).toBeGreaterThan(0)
    const initialCount = document.querySelectorAll(".maplibregl-marker").length

    await page.getByRole("button", { name: /Find places/ }).click()
    const search = page.getByRole("textbox", { name: "Search places" })
    await search.fill("ATM")
    await page.getByRole("button", { name: /Close/ }).click()

    await expect.element(page.getByRole("button", { name: /Clear filters/ })).toBeVisible()
    await expect.poll(() => document.querySelectorAll(".maplibregl-marker").length).toBeLessThan(initialCount)

    await page.getByRole("button", { name: /Clear filters/ }).click()
    await expect.poll(() => document.querySelectorAll(".maplibregl-marker").length).toBe(initialCount)
    await expect
        .poll(
            () =>
                [...document.querySelectorAll("button")].filter((b) => b.textContent?.includes("Clear filters")).length,
        )
        .toBe(0)
})
