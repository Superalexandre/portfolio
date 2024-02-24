import { sql } from "drizzle-orm"
import { text, sqliteTable, integer } from "drizzle-orm/sqlite-core"

export const accounts = sqliteTable("accounts", {
    id: text("id")
        .primaryKey()
        .unique()
        .notNull(),
    token: text("token")
        .unique()
        .notNull(),
    name: text("name", { length: 32 })
        .notNull(),
    firstName: text("first_name", { length: 32 })
        .notNull(),
    username: text("username", { length: 32 })
        .unique()
        .notNull(),
    birthDate: text("birth_date")
        .notNull(),
    mail: text("mail", { length: 255 })
        .unique()
        .notNull(),
    isVerified: integer("is_verified", { mode: "boolean" })
        .default(false),
    password: text("password")
        .notNull(),
    salt: text("salt")
        .notNull(),
    lastConnection: text("last_connection")
        .default(sql`CURRENT_TIMESTAMP`),
    updatedAt: text("updated_at")
        .default(sql`CURRENT_TIMESTAMP`),
    createdAt: text("created_at")
        .default(sql`CURRENT_TIMESTAMP`),
    favoriteLanguage: text("favorite_language", { length: 32, enum: ["fr-FR", "en-GB"] })
        .default("fr-FR"),
    favoriteTheme: text("favorite_theme", { length: 32, enum: ["light", "dark"] })
        .default("dark"),
    avatarSeed: text("avatar_seed", { length: 10 })
        .notNull()
        .$defaultFn(() => random()),
})

function random(min = 0, max = 1_000) {
    const number = Math.floor(Math.random() * (max - min + 1)) + min

    return number.toString()
}