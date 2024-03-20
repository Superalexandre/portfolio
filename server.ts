// import { serve } from "@hono/node-server"
import { serveStatic } from "@hono/node-server/serve-static"
import { AppLoadContext, ServerBuild } from "@remix-run/node"
import { Hono } from "hono"
import { compress } from "hono/compress"
import { remix } from "remix-hono/handler"
// import { Server } from "socket.io"
import "dotenv/config"
// import { v4 as uuid } from "uuid"

// import reply from "./ai/ai.js"
// import AIMessage from "./types/AIMessage"

const isDev = ["test", "development"].includes(process.env.NODE_ENV)

const app = new Hono()

async function getDevBuild() {
    if (!isDev) return

    const viteDevServer = await import("vite").then((vite) => vite.createServer({
        server: {
            middlewareMode: true
        }
    }))

    const module = await viteDevServer.ssrLoadModule(`virtual:remix/server-build?t=${Date.now()}`)

    return module
}

app.use(async (c, next) => {
    // eslint-disable-next-line import/no-unresolved
    const build = (isDev ? await getDevBuild() : await import("./build/index.js")) as unknown as ServerBuild

    return remix({
        build: () => build,
        mode: process.env.NODE_ENV as "development" | "production",
        getLoadContext: () => {
            return {
                appVersion: isDev ? build.assets.version : "dev"
            } satisfies AppLoadContext
        }
    })(c, next)
})

app.use(compress())
app.use("/*", serveStatic({ root: "./build/client" }))
// app.use("/build/*", serveStatic({ root: "./public/build" }))
app.use("/assets/*", serveStatic({ root: "./build/client" }))

/*
if (!isDev) {
    serve({
        ...app,
        port: Number(process.env.PORT) || 3000
    }, (info) => {
        console.log(`Server listening on http://localhost:${info.port} in ${process.env.NODE_ENV} mode.`)
    })
}
*/
/*
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
*/

export default app