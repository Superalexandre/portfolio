import Database from "better-sqlite3"
import { desc, eq } from "drizzle-orm"
import { drizzle } from "drizzle-orm/better-sqlite3"

import { databasePath } from "@/database/path"
import { personality } from "@/database/schema/personality"
import User from "@/types/User"

export default async function getPersonalities(user: User) {
    const sqlite = new Database(databasePath, { fileMustExist: true })
    const db = drizzle(sqlite)

    const personalities = await db
        .select()
        .from(personality)
        .where(
            eq(personality.userId, user.id)
        )
        .orderBy(desc(personality.createdAt))

    return {
        success: true,
        error: false,
        personalities
    }
}