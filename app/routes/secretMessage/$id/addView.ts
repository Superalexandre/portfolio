import Database from "better-sqlite3"
import { eq, sql } from "drizzle-orm"
import { drizzle } from "drizzle-orm/better-sqlite3"
import { migrate } from "drizzle-orm/better-sqlite3/migrator"

import { databasePath, migrationsFolder } from "~/database/path"
import { secretMessages } from "~/database/schema/secretMessages"

export default function addView(id: string, views = 1) {
    const sqlite = new Database(databasePath, { fileMustExist: true })
    const db = drizzle(sqlite)

    migrate(db, { migrationsFolder: migrationsFolder })

    db.update(secretMessages)
        .set({ views: sql`${secretMessages.views} + ${views}` })
        .where(eq(secretMessages.id, id))
        .run()

    return true
}