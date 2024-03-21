import { vitePlugin as remix } from "@remix-run/dev"
import react from "@vitejs/plugin-react"
import { flatRoutes } from "remix-flat-routes"
import { defineConfig } from "vite"
import tsconfigPaths from "vite-tsconfig-paths"

export default defineConfig({
    // Configure the Vite server
    server: {
        hmr: false,
        port: Number(process.env.PORT) || 3000,
    },
    build: {
        assetsDir: "public",
    },
    plugins: [
        react(),
        tsconfigPaths(),
        remix({
            // serverBuildFile: "server.ts",
            // ignoredRouteFiles: ["**/.*"],
            appDirectory: "app",
            buildDirectory: "./build",
            serverModuleFormat: "esm",
            routes: (defineRoutes) => {
                return flatRoutes("routes", defineRoutes)
            },
        }),
    ],
})