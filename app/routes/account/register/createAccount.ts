import { createHmac } from "crypto"

import { json } from "@remix-run/node"
import bcrypt from "bcryptjs"
import Database from "better-sqlite3"
import { drizzle } from "drizzle-orm/better-sqlite3"
import { migrate } from "drizzle-orm/better-sqlite3/migrator"
import { v4 as uuid } from "uuid"

import { databasePath, migrationsFolder } from "~/database/path"
import { accounts } from "~/database/schema/accounts"
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

    migrate(db, { migrationsFolder: migrationsFolder })

    const id = uuid()
    const token = genToken()

    const saltRounds = 10
    const salt = await bcrypt.genSalt(saltRounds)
    const hashedPassword = await bcrypt.hash(password, salt)

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