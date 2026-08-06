import { RouterProvider, createRouter } from "@tanstack/react-router"
import { page } from "vitest/browser"
import { createRoot, type Root } from "react-dom/client"
import { afterEach, expect, test } from "vitest"

import { routeTree } from "@/routeTree.gen"
import { ATTRACTIONS } from "@/data/attractions-generated"
import { beautifyLabel, facilityCategory } from "@/data/attractions"
import { useFilters } from "@/store/use-filters"
import { useFavourites } from "@/store/use-favourites"
import { useSelection } from "@/store/use-selection"
import { buildFilters, filterAttractions } from "@/utils/filters"

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
    useFilters.setState({ query: "", selected: [], open: false })
    useFavourites.setState({ ids: [] })
    useSelection.setState({ selectedId: null, flyToId: null, sheetOpen: false })
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

    await expect.element(page.getByRole("button", { name: "Clear Pin" })).toBeVisible()
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

    await expect.element(page.getByRole("button", { name: "Clear Pin" })).toBeVisible()
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

test("favourites stays selected and retained when a category filter is added", async () => {
    const favourited = ATTRACTIONS[0]!
    useFavourites.getState().toggle(favourited.id)
    mountApp("/")

    await page.getByRole("button", { name: /Filters/ }).click()
    await expect.poll(() => useFilters.getState().open).toBe(true)

    await page.getByRole("button", { name: /Favourites/ }).click()
    await expect.poll(() => useFilters.getState().selected).toContain("__favourites__")

    const favouriteKey = facilityCategory(favourited.group ?? favourited.category)
    const other = buildFilters().find((f) => f.key !== favouriteKey)!
    const otherLabel = beautifyLabel(other.key)
    await page.getByRole("button", { name: new RegExp(otherLabel) }).click()

    const selected = useFilters.getState().selected
    expect(selected).toContain("__favourites__")
    expect(selected).toContain(other.key)

    await expect
        .poll(() =>
            page
                .getByRole("button", { name: /Favourites/ })
                .element()
                .getAttribute("aria-pressed"),
        )
        .toBe("true")

    const results = filterAttractions("", selected, new Set([favourited.id]))
    expect(results.some((a) => a.id === favourited.id)).toBe(true)

    await expect
        .poll(() => page.getByRole("button", { name: /Show \d+ places?/ }).element().textContent)
        .toContain(String(results.length))
})
