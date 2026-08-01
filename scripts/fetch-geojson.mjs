import { mkdirSync, writeFileSync } from "node:fs"
import path from "node:path"

const DATA_DIR = path.join(import.meta.dirname, "data")
mkdirSync(DATA_DIR, { recursive: true })

const BASE = "https://maps.vdl.lu"
const WEBMAP_ID = "62fdf441f97e4c12a197fc70a86c712f"
const FEATURE_SERVER = `${BASE}/arcgis/rest/services/STORYMAP/SCHUEBERFOUER/FeatureServer`

console.log("Fetching webmap config...")
const webmapResp = await fetch(`${BASE}/portal/sharing/rest/content/items/${WEBMAP_ID}/data?f=json`)
if (!webmapResp.ok) throw new Error(`Webmap fetch failed: ${webmapResp.status}`)
const webmap = await webmapResp.json()
const opLayers = webmap.operationalLayers
const title = opLayers && opLayers.length > 0 && opLayers[0].title ? opLayers[0].title : "Unknown"
console.log(`Webmap title: ${title}`)

console.log("\nFetching FeatureServer layer index...")
const fsResp = await fetch(`${FEATURE_SERVER}?f=json`)
if (!fsResp.ok) throw new Error(`FeatureServer fetch failed: ${fsResp.status}`)
const fs = await fsResp.json()

const datasets = fs.layers.concat(fs.tables !== undefined && fs.tables !== null ? fs.tables : [])
console.log(
    `Found ${datasets.length} datasets (${fs.layers.length} layers, ${fs.tables !== undefined && fs.tables !== null ? fs.tables.length : 0} tables)`,
)

for (const ds of datasets) {
    const lid = ds.id
    const name = ds.name
    const isTable = ds.type === "Table"
    const label = isTable ? "Table" : "Layer"

    console.log(`\n[${label} ${lid}] ${name} — querying...`)

    const url = new URL(`${FEATURE_SERVER}/${lid}/query`)
    url.searchParams.set("where", "1=1")
    url.searchParams.set("outFields", "*")
    url.searchParams.set("f", "geojson")
    url.searchParams.set("returnGeometry", "true")

    const r = await fetch(url)
    if (r.ok) {
        const data = await r.json()

        const features = data.features === undefined ? [] : data.features
        console.log(`  → ${features.length} features`)

        const filename = `schueberfouer_${name}.geojson`
        writeFileSync(path.join(DATA_DIR, filename), JSON.stringify(data, null, 4), "utf8")
        console.log(`  → saved to ${filename}`)
    } else {
        throw new Error(`Query failed for ${name}: ${r.status}`)
    }
}
