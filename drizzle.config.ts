import { defineConfig } from "drizzle-kit"
import type { Config } from "drizzle-kit"

export default defineConfig({
    schema: "./database/schema/*",
    out: "./database/migrations",
    driver: "better-sqlite",
    verbose: true,
    strict: true,
} satisfies Config)