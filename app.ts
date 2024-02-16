import fs from "node:fs"
import path from "node:path"
import url from "node:url"

import { fastifyEarlyHints } from "@fastify/early-hints"
import { fastifyStatic } from "@fastify/static"
import type { GetLoadContextFunction, RequestHandler as RequestHandlerRemix } from "@mcansh/remix-fastify"
import { createRequestHandler, getEarlyHintLinks } from "@mcansh/remix-fastify"
import type { ServerBuild} from "@remix-run/node"
import { broadcastDevReady, installGlobals } from "@remix-run/node"
import fastify from "fastify"
import "dotenv/config"

installGlobals()

const __dirname = url.fileURLToPath(new URL(".", import.meta.url))
const BUILD_PATH = "./build/index.js"
const VERSION_PATH = "./build/version.txt"

const initialBuild: ServerBuild = await import(BUILD_PATH)

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let handler: any

if (process.env.NODE_ENV === "development") {
    handler = await createDevRequestHandler(initialBuild)
} else {
    handler = createRequestHandler({
        build: initialBuild,
        mode: initialBuild.mode,
    })
}

const app = fastify()

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const noopContentParser = (_request: any, payload: any, done: any) => {
    done(null, payload)
}

app.addContentTypeParser("application/json", noopContentParser)
app.addContentTypeParser("*", noopContentParser)

await app.register(fastifyEarlyHints, { warn: true })

await app.register(fastifyStatic, {
    root: path.join(__dirname, "public"),
    prefix: "/",
    wildcard: false,
    cacheControl: true,
    dotfiles: "allow",
    etag: true,
    maxAge: "1h",
    serveDotFiles: true,
    lastModified: true
})

await app.register(fastifyStatic, {
    root: path.join(__dirname, "public", "build"),
    prefix: "/build",
    wildcard: true,
    decorateReply: false,
    cacheControl: true,
    dotfiles: "allow",
    etag: true,
    maxAge: "1y",
    immutable: true,
    serveDotFiles: true,
    lastModified: true,
})

app.all("*", async (request, reply) => {
    if (process.env.NODE_ENV === "production") {
        const links = getEarlyHintLinks(request, initialBuild)
        await reply.writeEarlyHintsLinks(links)
    }

    return handler(request, reply)
})

const port = process.env.PORT ? Number(process.env.PORT) || 3000 : 3000

const address = await app.listen({ port, host: "0.0.0.0" })
console.log(`✅ app ready: ${address} | NODE_ENV=${process.env.NODE_ENV}`)

if (process.env.NODE_ENV === "development") {
    await broadcastDevReady(initialBuild)
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function createDevRequestHandler(initialBuildParam: ServerBuild, getLoadContext?: GetLoadContextFunction<any>): Promise<RequestHandlerRemix<any>> {
    let build = initialBuildParam

    async function handleServerUpdate() {
        // 1. re-import the server build
        build = await reimportServer()
        // 2. tell Remix that this app server is now up-to-date and ready
        await broadcastDevReady(build)
    }

    const chokidar = await import("chokidar")
    chokidar
        .watch(VERSION_PATH, { ignoreInitial: true })
        .on("add", handleServerUpdate)
        .on("change", handleServerUpdate)

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return async (request: any, reply) => {
        const links = getEarlyHintLinks(request, build)
        await reply.writeEarlyHintsLinks(links)

        return createRequestHandler({
            build: build,
            getLoadContext,
            mode: "development",
        })(request, reply)
    }
}

function reimportServer(): Promise<ServerBuild> {
    const stat = fs.statSync(BUILD_PATH)

    // convert build path to URL for Windows compatibility with dynamic `import`
    const BUILD_URL = url.pathToFileURL(BUILD_PATH).href

    // use a timestamp query parameter to bust the import cache
    return import(BUILD_URL + "?t=" + stat.mtimeMs)
}
