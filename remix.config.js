import { flatRoutes } from "remix-flat-routes"

/** @type {import('@remix-run/dev').AppConfig} */
export default {
    ignoredRouteFiles: ["**/.*"],
    appDirectory: "app",
    assetsBuildDirectory: "public/build",
    publicPath: "/build/",
    serverBuildPath: "build/index.js",
    serverDependenciesToBundle: [
        "remix-i18next",
    ],
    serverModuleFormat: "esm",
    serverPlatform: "node",
    // cacheDirectory: "./node_modules/.cache/remix",
    browserNodeBuiltinsPolyfill: {
        modules: {
            fs: true,
            path: true,
            process: true,
            util: true,
            buffer: true,
            url: true      
        }
    },
    serverMinify: process.env.NODE_ENV === "production",
    routes: (defineRoutes) => {
        return flatRoutes("routes", defineRoutes)
    }
}
