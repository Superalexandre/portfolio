import Database from "better-sqlite3"
import { eq } from "drizzle-orm"
import { drizzle } from "drizzle-orm/better-sqlite3"
import { migrate } from "drizzle-orm/better-sqlite3/migrator"

import { databasePath, migrationsFolder } from "~/database/path"
import { accounts } from "~/database/schema/accounts"

export default async function getProfile(token: string) {
    const sqlite = new Database(databasePath, { fileMustExist: true })
    const db = drizzle(sqlite)

    migrate(db, { migrationsFolder: migrationsFolder })

    const users = await db
        .select()
        .from(accounts)
        .where(
            eq(accounts.token, token)
        )
        .execute()

    if (!users || users.length === 0 || !users[0]) return null
    
    const user = users[0]

    return user
}