import { serve } from "@hono/node-server"
import { serveStatic } from "@hono/node-server/serve-static"
import { Hono } from "hono"
import { remix } from "remix-hono/handler"

import * as build from "./build/index.js"

import "dotenv/config"

const app = new Hono()

app.use("/*", serveStatic({ root: "./public" }))
app.use("/build/*", serveStatic({ root: "./public/build" }))
app.use("*", remix({ build, mode: process.env.NODE_ENV }))

serve({
    fetch: app.fetch,
    port: Number(process.env.PORT) || 3000
}, (info) => {
    console.log(`Server listening on http://localhost:${info.port}`)
})
