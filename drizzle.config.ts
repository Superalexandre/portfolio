import { defineConfig } from "drizzle-kit"
import type { Config } from "drizzle-kit"

const config: Config = {
    schema: "./database/schema/*",
    out: "./database/migrations",
    driver: "better-sqlite",
    verbose: true,
    strict: true,
}

export default defineConfig(config)