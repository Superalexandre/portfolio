declare module "remix-hono/handler" {
    import { Hono } from "hono"
    import { BuildOptions } from "remix"
    export function remix(options: BuildOptions): Hono.Middleware
}