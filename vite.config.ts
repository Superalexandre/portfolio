import devServer, { defaultOptions } from "@hono/vite-dev-server"
import { vitePlugin as remix } from "@remix-run/dev"
import esbuild from "esbuild"
import { flatRoutes } from "remix-flat-routes"
import { defineConfig } from "vite"
import tsconfigPaths from "vite-tsconfig-paths"

export default defineConfig({
    // Configure the Vite server
    server: {
        watch: {
            usePolling: true,
        },
        hmr: {
            clientPort: 3000,
            port: 3005,
        },
        port: Number(process.env.PORT) || 3000,
    },
    plugins: [
        devServer({
            injectClientScript: false,
            entry: "./server.ts",
            exclude: [/^\/(app)\/.+/, ...defaultOptions.exclude]
        }),
        tsconfigPaths(),
        remix({
            serverBuildFile: "remix.js",
            // ignoredRouteFiles: ["**/.*"],
            // appDirectory: "app",
            // buildDirectory: "public/build",
            // serverModuleFormat: "esm",
            routes: (defineRoutes) => {
                return flatRoutes("routes", defineRoutes)
            },
            buildEnd: async() => {
                await esbuild
                    .build({
                        outfile: "./build/server.js",
                        entryPoints: ["./server.ts"],
                        external: ["./build/*"],
                        platform: "node",
                        format: "esm",
                        packages: "external",
                        bundle: true,
                        logLevel: "info"
                    })
                    .catch((error: unknown) => {
                        console.error(error)
                        process.exit(1)
                    })
            }
        }),
    ],
})