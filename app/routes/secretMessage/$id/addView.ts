import Database from "better-sqlite3"
import { eq, sql } from "drizzle-orm"
import { drizzle } from "drizzle-orm/better-sqlite3"

import { databasePath } from "@/database/path"
import { secretMessages } from "@/database/schema/secretMessages"

export default function addView(id: string, views = 1) {
    const sqlite = new Database(databasePath, { fileMustExist: true })
    const db = drizzle(sqlite)

    db.update(secretMessages)
        .set({ views: sql`${secretMessages.views} + ${views}` })
        .where(eq(secretMessages.id, id))
        .run()

    return true
}