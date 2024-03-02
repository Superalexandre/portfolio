import { createHmac } from "crypto"

import { json } from "@remix-run/node"
import bcrypt from "bcryptjs"
import Database from "better-sqlite3"
import { eq, sql } from "drizzle-orm"
import { drizzle } from "drizzle-orm/better-sqlite3"
import { v4 as uuid } from "uuid"

import { databasePath } from "@/database/path"
import { accounts } from "@/database/schema/accounts"
import { createUserSession } from "~/session.server"

interface FormData {
    request: Request,
    name: string;
    firstName: string;
    username: string;
    birthDate: Date;
    mail: string;
    password: string;
}

export default async function createAccount({ request, name, firstName, username, birthDate, mail, password }: FormData) {
    const sqlite = new Database(databasePath, { fileMustExist: true })
    const db = drizzle(sqlite)

    const id = uuid()
    const token = genToken()

    const saltRounds = 10
    const salt = await bcrypt.genSalt(saltRounds)
    const hashedPassword = await bcrypt.hash(password, salt)

    // Find if the mail or username already exists
    const mailExists = await db
        .select()
        .from(accounts)
        .where(
            eq(
                sql<string>`lower(${accounts.mail})`,
                mail
            )
        )

    const usernameExists = await db
        .select()
        .from(accounts)
        .where(
            eq(
                sql<string>`lower(${accounts.username})`,
                username.toLowerCase()
            )
        )

    if (mailExists.length > 0 || usernameExists.length > 0) {
        const errors: { [key: string]: { message: string } } = {}

        if (mailExists.length > 0) {
            errors.mail = { message: "Un utilisateur possède deja cette adresse mail" }
        }

        if (usernameExists.length > 0) {
            errors.username = { message: "Un utilisateur possède deja ce nom d'utilisateur" }
        }

        return json({
            success: false,
            error: true,
            errors,
            message: "Une erreur est survenue lors de la création du compte !"
        }, { status: 500 })
    }

    try {
        db.insert(accounts).values({
            id: id,
            token: token,
            name,
            firstName,
            username,
            birthDate: birthDate.toISOString(),
            mail,
            password: hashedPassword,
            salt: salt,
        }).run()
    } catch (error) {
        const defaultError = json({
            success: false,
            error: true,
            errors: {
                root: { message: "Une erreur est survenue lors de la création du compte !" },
            },
            message: "Une erreur est survenue lors de la création du compte !"
        }, { status: 500 })

        if (!(error instanceof Error)) return defaultError

        const match = error.message.match(/UNIQUE constraint failed: accounts\.(\w+)/)
        if (!match) return defaultError

        return json({
            success: false,
            error: true,
            errors: {
                // mail: { message: "Une erreur est survenue lors de la création du compte !" },
                [match[1]]: { message: `Un utilisateur possède deja ce ${match[1]}` },
            },
            message: "Une erreur est survenue lors de la création du compte !"
        }, { status: 500 })
    }

    return createUserSession({
        request,
        token: token,
        redirectUrl: "/account/profile",
    })
}

function genToken(): string {
    const timestamp = new Date().getTime()
    const secret = process.env.SECRET as string
    const hash = createHmac("sha256", secret)
        .update(timestamp.toString())
        .digest("hex")

    return hash
}