import { serve } from "@hono/node-server"
import { serveStatic } from "@hono/node-server/serve-static"
import { Hono } from "hono"
import { remix } from "remix-hono"

import "dotenv/config"

const BUILD_PATH = "./build/index.js"
const app = new Hono()

app.use("/*", serveStatic({ root: "./public" }))
app.use("/build/*", serveStatic({ root: "./public/build" }))
app.use("*", remix({ build: await import(BUILD_PATH), mode: process.env.NODE_ENV }))

serve({
    fetch: app.fetch,
    port: Number(process.env.PORT) || 3000
}, (info) => {
    console.log(`Server listening on http://localhost:${info.port}`)
})
