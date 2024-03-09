import Database from "better-sqlite3"
import { drizzle } from "drizzle-orm/better-sqlite3"
import { v4 as uuid } from "uuid"

import { databasePath } from "@/database/path"
import { personality as personalitySchema } from "@/database/schema/personality"
import { getUser } from "~/session.server"

import { getQuestions } from "./getQuestions"

export async function getResults({ request, name }: { request: Request, name: string}) {
    // Get form data
    const body = await request.formData()
    const repliesString = body.get("replies")

    if (!repliesString) return null

    const replies = JSON.parse(repliesString as string)

    const questions = getQuestions(name)
    if (!questions) return null

    const results = questions.results
    const totalPoints = replies.reduce((acc: number, curr: { points: number, reply: number }) => acc + curr.points, 0)

    // Find the personality based on the total points
    const personality = results.find(result => {
        return totalPoints >= result.minPoints && totalPoints <= result.maxPoints
    })

    if (!personality) return null

    const user = await getUser(request)

    const sqlite = new Database(databasePath, { fileMustExist: true })
    const db = drizzle(sqlite)

    const id = uuid()

    await db
        .insert(personalitySchema)
        .values({
            id,
            personage: personality.personnage,
            points: totalPoints,
            createdAt: new Date().toISOString(),
            userId: user?.id || null,
            testName: name
        })


    return personality
}