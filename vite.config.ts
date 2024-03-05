import devServer from "@hono/vite-dev-server"
import { vitePlugin as remix } from "@remix-run/dev"
import { flatRoutes } from "remix-flat-routes"
import { defineConfig } from "vite"
import tsconfigPaths from "vite-tsconfig-paths"

export default defineConfig({
    // Configure the Vite server
    server: {
        port: Number(process.env.PORT) || 3000,
    },
    plugins: [
        devServer({
            entry: "server.ts",
        }),
        tsconfigPaths(),
        remix({
            ignoredRouteFiles: ["**/.*"],
            appDirectory: "app",
            buildDirectory: "public/build",
            serverModuleFormat: "esm",
            routes: (defineRoutes) => {
                return flatRoutes("routes", defineRoutes)
            }
        }),
    ],
})