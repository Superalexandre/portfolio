import Database from "better-sqlite3"
import { eq } from "drizzle-orm"
import { drizzle } from "drizzle-orm/better-sqlite3"

import { databasePath } from "@/database/path"
import { secretMessages } from "@/database/schema/secretMessages"

export default async function getMessage(id: string) {
    const sqlite = new Database(databasePath, { fileMustExist: true })
    const db = drizzle(sqlite)

    const message = await db
        .select()
        .from(secretMessages)
        .where(
            eq(secretMessages.id, id)
        )

    return message[0] || null
}