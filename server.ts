import { serve } from "@hono/node-server"
import { serveStatic } from "@hono/node-server/serve-static"
import { Hono } from "hono"
import { remix } from "remix-hono/handler"

import "dotenv/config"

const BUILD_PATH = "./build/index.js"
const app = new Hono()

app.use("/*", serveStatic({ root: "./public" }))
app.use("/build/*", serveStatic({ root: "./public/build" }))
app.use("*", remix({ build: await import(BUILD_PATH), mode: process.env.NODE_ENV }))
app.notFound((c) => {
    return c.text("Not Found", { status: 404 })
})
app.onError((error, c) => {
    console.error(error)
    return c.text("Internal Server Error", { status: 500 })
})

serve({
    fetch: app.fetch,
    port: Number(process.env.PORT) || 3000
}, (info) => {
    console.log(`Server listening on http://localhost:${info.port} in ${process.env.NODE_ENV} mode.`)
})
