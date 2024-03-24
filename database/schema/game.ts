// import { relations } from "drizzle-orm"
import { text, sqliteTable, integer } from "drizzle-orm/sqlite-core"

import { accounts } from "./accounts"

export const game = sqliteTable("game", {
    id: text("id")
        .primaryKey()
        .unique()
        .notNull(),
    name: text("name")
        .notNull(),
    seed: text("seed"),
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
    // link gameStations
    // link gameLines
    // link gameTrains
})

export const gameStation = sqliteTable("game_station", {
    id: text("id")
        .primaryKey()
        .unique()
        .notNull(),
    gameId: text("game_id")
        .references(() => game.id, { onDelete: "cascade" })
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

export const gameLine = sqliteTable("game_line", {
    id: text("id")
        .primaryKey()
        .unique()
        .notNull(),
    gameId: text("game_id")
        .references(() => game.id, { onDelete: "cascade" })
        .notNull(),
    from: text("from_id")
        .references(() => gameStation.id)
        .notNull(),
    to: text("to_id")
        .references(() => gameStation.id)
        .notNull(),
    color: text("color")
        .notNull()
})

export const gameTrain = sqliteTable("game_train", {
    id: text("id")
        .primaryKey()
        .unique()
        .notNull(),
    gameId: text("game_id")
        .references(() => game.id, { onDelete: "cascade" })
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

// export const gameRelations = relations(game, ({ one, many }) => ({
//     game: one(game),
//     stations: many(gameStation),
//     lines: many(gameLine),
//     trains: many(gameTrain)
// }))