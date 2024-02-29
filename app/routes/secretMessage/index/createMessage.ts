import Database from "better-sqlite3"
import { drizzle } from "drizzle-orm/better-sqlite3"
import { migrate } from "drizzle-orm/better-sqlite3/migrator"
import { v4 as uuid } from "uuid"

import { databasePath, migrationsFolder } from "@/database/path"
import { secretMessages } from "@/database/schema/secretMessages"
import User from "@/types/User"

type BackgroundColor = "dark" | "white" | "pink"
type Ambiance = "normal" | "confetti" | "love" | "rain"

interface Params {
    isQuestion: boolean
    ambiance: Ambiance
    backgroundColor: BackgroundColor
}

export default function createMessage(message: string, author: string, account: User | null, { isQuestion, ambiance, backgroundColor }: Params = { isQuestion: false, ambiance: "normal", backgroundColor: "dark" }) {
    const sqlite = new Database(databasePath, { fileMustExist: true })
    const db = drizzle(sqlite)

    migrate(db, { migrationsFolder: migrationsFolder })

    const id = uuid()
    const secretCode = Math.random().toString(36).substring(2, 6)

    db.insert(secretMessages).values({
        id: id,
        secretCode: secretCode,
        message,
        author,
        createdAt: new Date().toISOString(),
        isQuestion: isQuestion,
        ambiance,
        backgroundColor,
        userId: account?.id || null
    }).run()

    return {
        success: true,
        error: false,
        message: "Message créé avec succès !",
        id
    }
}

export type {
    Params,
    BackgroundColor,
    Ambiance
}