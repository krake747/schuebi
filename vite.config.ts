import babel from "@rolldown/plugin-babel"
import tailwindcss from "@tailwindcss/vite"
import { tanstackRouter } from "@tanstack/router-plugin/vite"
import react, { reactCompilerPreset } from "@vitejs/plugin-react"
import { playwright } from "@vitest/browser-playwright"
import { fileURLToPath, URL } from "node:url"
import { defineConfig } from "vitest/config"

// oxlint-disable-next-line import/no-default-export
export default defineConfig({
    plugins: [
        tanstackRouter({
            target: "react",
            autoCodeSplitting: true,
        }),
        react(),
        babel({
            presets: [reactCompilerPreset()],
        }),
        tailwindcss(),
    ],
    resolve: {
        alias: {
            "@": fileURLToPath(new URL("./src", import.meta.url)),
        },
    },
    build: {
        target: "esnext",
        chunkSizeWarningLimit: 1000,
        rolldownOptions: {
            output: {
                codeSplitting: {
                    groups: [
                        { name: "maplibre", test: /node_modules\/maplibre-gl\// },
                        { name: "react", test: /node_modules\/(react|react-dom|scheduler)\// },
                    ],
                },
            },
        },
    },
    optimizeDeps: {
        exclude: ["maplibre-gl"],
    },
    test: {
        browser: {
            enabled: true,
            provider: playwright(),
            headless: true,
            instances: [{ browser: "chromium" }],
        },
    },
})
