import Database from "better-sqlite3"
import { drizzle } from "drizzle-orm/better-sqlite3"
import { migrate } from "drizzle-orm/better-sqlite3/migrator"

import { databasePath, migrationsFolder } from "./path"

function migrateDatabase() {
    const sqlite = new Database(databasePath, { fileMustExist: true })
    const db = drizzle(sqlite)

    migrate(db, { migrationsFolder: migrationsFolder })

    sqlite.close()

    console.log("Database migrated")

    return true
}

migrateDatabase()