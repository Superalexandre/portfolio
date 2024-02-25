import { text, sqliteTable, integer } from "drizzle-orm/sqlite-core"

import { accounts } from "./accounts"

export const secretMessages = sqliteTable("secret_messages", {
    id: text("id")
        .primaryKey()
        .unique()
        .notNull(),
    secretCode: text("secret_code", { length: 4 })
        .notNull(),
    message: text("message", { length: 2048 })
        .notNull(),
    isQuestion: integer("is_question", { mode: "boolean" })
        .notNull()
        .default(false),
    author: text("author", { length: 32 })
        .notNull(),
    createdAt: text("created_at")
        .notNull(),
    views: integer("views")
        .notNull()
        .default(0),
    backgroundColor: text("background_color", { enum: ["dark", "white", "pink"] })
        .notNull()
        .default("dark"),
    ambiance: text("ambiance", { enum: ["normal", "confetti", "love", "rain"] })
        .notNull()
        .default("normal"),
    userId: text("user_id")
        .references(() => accounts.id)
})