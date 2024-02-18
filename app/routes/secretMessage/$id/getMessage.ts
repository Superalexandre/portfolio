import Database from "better-sqlite3"
import { eq } from "drizzle-orm"
import { drizzle } from "drizzle-orm/better-sqlite3"
import { migrate } from "drizzle-orm/better-sqlite3/migrator"

import { databasePath, migrationsFolder } from "~/database/path"
import { secretMessages } from "~/database/schema/secretMessages"

export default async function getMessage(id: string) {
    const sqlite = new Database(databasePath, { fileMustExist: true })
    const db = drizzle(sqlite)

    migrate(db, { migrationsFolder: migrationsFolder })

    const message = await db.select().from(secretMessages).where(eq(secretMessages.id, id))

    return message[0] || null
}