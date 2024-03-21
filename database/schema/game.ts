import { text, sqliteTable, integer } from "drizzle-orm/sqlite-core"

import { accounts } from "./accounts"

export const game = sqliteTable("game", {
    id: text("id")
        .primaryKey()
        .unique()
        .notNull(),
    createdAt: text("created_at")
        .notNull(),
    updatedAt: text("updated_at")
        .notNull(),
    canvasWidth: integer("canvas_width")
        .notNull(),
    canvasHeight: integer("canvas_height")
        .notNull(),
    userId: text("user_id")
        .references(() => accounts.id)
})

export const gameStations = sqliteTable("game_stations", {
    id: text("id")
        .primaryKey()
        .unique()
        .notNull(),
    gameId: text("game_id")
        .references(() => game.id)
        .notNull(),
    x: integer("x")
        .notNull(),
    y: integer("y")
        .notNull(),
    shape: text("shape", { enum: ["circle", "square", "triangle", "star"] })
        .notNull(),
    highlighted: integer("highlighted", { mode: "boolean" })
        .notNull()
})

export const gameLines = sqliteTable("game_lines", {
    id: text("id")
        .primaryKey()
        .unique()
        .notNull(),
    gameId: text("game_id")
        .references(() => game.id)
        .notNull(),
    from: text("id")
        .references(() => gameStations.id)
        .notNull(),
    to: text("id")
        .references(() => gameStations.id)
        .notNull(),
    color: text("text")
        .notNull()
})

export const gameTrains = sqliteTable("game_trains", {
    id: text("id")
        .primaryKey()
        .unique()
        .notNull(),
    gameId: text("game_id")
        .references(() => game.id)
        .notNull(),
    x: integer("x")
        .notNull(),
    y: integer("y")
        .notNull(),
    color: text("color")
        .notNull(),
    /*
    lines: [
        {
            ...gameLines,
            color: ""
            "order": 1,
        }
    ]
    */
})