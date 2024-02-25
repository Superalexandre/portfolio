import Database from "better-sqlite3"
import { desc, eq } from "drizzle-orm"
import { drizzle } from "drizzle-orm/better-sqlite3"
import { migrate } from "drizzle-orm/better-sqlite3/migrator"

import User from "types/User"
import { databasePath, migrationsFolder } from "~/database/path"
import { secretMessages } from "~/database/schema/secretMessages"

export default async function getMessages(user: User) {
    const sqlite = new Database(databasePath, { fileMustExist: true })
    const db = drizzle(sqlite)

    migrate(db, { migrationsFolder: migrationsFolder })

    const messages = await db
        .select()
        .from(secretMessages)
        .where(
            eq(secretMessages.userId, user.id)
        )
        .orderBy(desc(secretMessages.createdAt))

    return {
        success: true,
        error: false,
        messages
    }
}