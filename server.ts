import { serve } from "@hono/node-server"
import { serveStatic } from "@hono/node-server/serve-static"
import { Hono } from "hono"
import { compress } from "hono/compress"
import { remix } from "remix-hono/handler"
import { Server } from "socket.io"
import "dotenv/config"
import { v4 as uuid } from "uuid"

import reply from "./ai/ai.js"
import AIMessage from "./types/AIMessage"

const BUILD_PATH = "./build/index.js"
const app = new Hono()

/*
Issue #35
const viteDevServer = process.env.NODE_ENV === "development" ?
    await import("vite").then((vite) => vite.createServer({
        server: {
            middlewareMode: true
        }
    }))
    : undefined

const remixHandler = remix({
    build: viteDevServer ? () => viteDevServer.ssrLoadModule("virtual:remix/server-build") : await import(BUILD_PATH),
    mode: process.env.NODE_ENV as "production" | "development",
})

if (viteDevServer) {
    console.log(viteDevServer)

    app.use(viteDevServer.middlewares as any)
} else {
    app.use(remixHandler)
}
*/

app.use(compress())
app.use("/*", serveStatic({ root: "./public" }))
app.use("/build/*", serveStatic({ root: "./public/build" }))
app.use("*", remix({
    build: await import(BUILD_PATH),
    mode: process.env.NODE_ENV as "production" | "development"
}))

const server = serve({
    fetch: app.fetch,
    port: Number(process.env.PORT) || 3000
}, (info) => {
    console.log(`Server listening on http://localhost:${info.port} in ${process.env.NODE_ENV} mode.`)
})

const io = new Server(server, {
    path: "/api/ws"
})

io.on("connection", (socket) => {
    console.log("New connection")

    socket.on("message", async (data) => {
        socket.emit("message", data)

        if (process.env.IA_ACTIVE === "true") {
            await reply({ socket, message: data.content })
        } else {
            socket.emit("message", {
                id: uuid(),
                author: "AI",
                date: new Date(),
                analyzing: false,
                time: 0,
                content: "IA is not active",
            } satisfies AIMessage)
        }
    })

    socket.on("disconnect", () => {
        console.log("Connection closed")
    })
})

export default app