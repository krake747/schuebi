# Schuebi

Drop a pin at the Schueberfouer and share your meeting point with your friends.

## Features

- Interactive map of attractions (rides, food stalls, games, toilets) powered by MapLibre
- Drop a pin anywhere on the map to set your meeting point
- Share the location via URL or the Web Share API
- Search and filter attractions by category

## Stack

React 19, TypeScript, Vite, Tailwind CSS 4, shadcn/ui, MapLibre GL JS, TanStack Router

## Getting started

```sh
pnpm install
pnpm dev
```

Other useful scripts: `pnpm build`, `pnpm lint`, `pnpm preview`.

## Data sources

- Attractions from the Ville de Luxembourg ArcGIS FeatureServer (`maps.vdl.lu`)
- Map tiles from `geoportail.lu` (roadmap style)

Regenerate the attractions data with `pnpm fetch:geojson` and `pnpm generate:attractions`.

## License

[AGPLv3](LICENSE)
