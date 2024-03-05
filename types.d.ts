declare module "remix-hono/handler" {
    import { Hono } from "hono"
    import { BuildOptions } from "remix"

    export function remix(options: {
        build: () => Promise<BuildOptions> | BuildOptions,
        getLoadContext?: (req: Request) => Record<string, unknown>
        mode: "production" | "development"
    }): Hono.Middleware
}