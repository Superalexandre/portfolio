import { serve } from "@hono/node-server"
import { ServerType } from "@hono/node-server/dist/types.js"
import { serveStatic } from "@hono/node-server/serve-static"
import { AppLoadContext, ServerBuild } from "@remix-run/node"
import { Hono } from "hono"
import { compress } from "hono/compress"
import { remix } from "remix-hono/handler"
import "dotenv/config"
import { Server } from "socket.io"
import { v4 as uuid } from "uuid"

import reply from "./ai/ai.js"
import AIMessage from "./types/AIMessage"

const isDev = ["test", "development"].includes(process.env.NODE_ENV)

const app = new Hono()

async function getDevBuild() {
    if (!isDev) return

    const server = await import("vite").then((vite) => vite.createServer({
        server: {
            middlewareMode: true,
            proxy: {
                "/api/ws": "ws://localhost:3000/api/ws"
            }
        }
    }))

    const module = await server.ssrLoadModule(`virtual:remix/server-build?t=${Date.now()}`)

    return module
}

app.use(compress())
app.use("/*", serveStatic({ root: "./build/client" }))
app.use("/build/*", serveStatic({ root: isDev ? "./public/build" : "./build/client" }))
app.use("/assets/*", serveStatic({ root: isDev ? "./public/assets" : "./build/client/assets" }))
app.use(async (c, next) => {
    const path = "./build/server/index.js"
    const build = (isDev ? await getDevBuild() : await import(path)) as unknown as ServerBuild

    return remix({
        build: () => build,
        mode: process.env.NODE_ENV as "development" | "production",
        getLoadContext: () => {
            return {} satisfies AppLoadContext
        }
    })(c, next)
})

if (!isDev) {
    const server = serve({
        ...app,
        port: Number(process.env.PORT) || 3000
    }, (info) => {
        console.log(`Server listening on http://localhost:${info.port} in ${process.env.NODE_ENV} mode.`)
    })

    createWebsocket(server)
}

function createWebsocket(server: ServerType | null) {
    if (!server) return console.error("Server is not defined")

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
}


export default app