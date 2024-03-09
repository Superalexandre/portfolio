import { text, sqliteTable, integer } from "drizzle-orm/sqlite-core"

import { accounts } from "./accounts"

export const personality = sqliteTable("personality", {
    id: text("id")
        .primaryKey()
        .unique()
        .notNull(),
    testName: text("test_name", { length: 32 })
        .notNull(),
    personage: text("personage", { length: 32 })
        .notNull(),
    points: integer("points")
        .notNull(),
    createdAt: text("created_at")
        .notNull(),
    userId: text("user_id")
        .references(() => accounts.id)
})