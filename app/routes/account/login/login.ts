import { json } from "@remix-run/node"
import bcrypt from "bcryptjs"
import Database from "better-sqlite3"
import { eq, or, sql } from "drizzle-orm"
import { drizzle } from "drizzle-orm/better-sqlite3"

import { databasePath } from "@/database/path"
import { accounts } from "@/database/schema/accounts"
import { createUserSession } from "~/session.server"

export default async function login({ request, mailOrUsername, password }: { request: Request, mailOrUsername: string, password: string }) {
    const sqlite = new Database(databasePath, { fileMustExist: true })
    const db = drizzle(sqlite)

    const users = await db
        .select()
        .from(accounts)
        .where(
            or(
                eq(
                    sql<string>`lower(${accounts.username})`, 
                    mailOrUsername.toLowerCase()
                ),
                eq(
                    sql<string>`lower(${accounts.mail})`, 
                    mailOrUsername.toLowerCase()
                )
            )
        )
        .execute()

    if (!users || users.length === 0 || !users[0]) {
        return json({
            success: false,
            error: true,
            errors: {
                mailOrUsername: { message: "Nom d'utilisateur ou email introuvable" },
            },
            message: "Nom d'utilisateur ou email introuvable"
        }, { status: 404 })
    }
    
    const user = users[0]

    const match = await bcrypt.compare(password, user.password)
    if (!match) {
        return json({
            success: false,
            error: true,
            errors: {
                password: { message: "Mot de passe incorrect" },
            },
            message: "Mot de passe incorrect"
        }, { status: 401 })
    }

    return createUserSession({
        request,
        token: user.token,
        redirectUrl: "/account/profile",
    })
}