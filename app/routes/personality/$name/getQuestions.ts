import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

interface QuestionFile {
    name: string
    prettyName: string
    questions: {
        question: string
        answers: {
            answer: string
            points: number
        }[]
    }[]
    results: {
        personnage: string
        minPoints: number
        maxPoints: number
    }[]
}

export function getQuestions(name: string) {
    const __dirname = path.dirname(fileURLToPath(import.meta.url))
    const pathJson = path.join(__dirname, "..", "app", "routes", "personality", "questions", `${name}.json`)

    const hasFile = fs.existsSync(pathJson)
    if (!hasFile) return null

    const file = fs.readFileSync(pathJson, "utf-8")

    return JSON.parse(file) as QuestionFile
}