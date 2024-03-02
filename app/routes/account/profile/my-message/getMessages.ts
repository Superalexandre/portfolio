import Database from "better-sqlite3"
import { desc, eq } from "drizzle-orm"
import { drizzle } from "drizzle-orm/better-sqlite3"

import { databasePath } from "@/database/path"
import { secretMessages } from "@/database/schema/secretMessages"
import User from "@/types/User"

export default async function getMessages(user: User) {
    const sqlite = new Database(databasePath, { fileMustExist: true })
    const db = drizzle(sqlite)

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