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

export function getPersonalities() {

    const __dirname = path.dirname(fileURLToPath(import.meta.url))
    const pathJson = path.join(__dirname, "..", "app", "routes", "personality", "questions")

    const files = fs.readdirSync(pathJson).map(file => {
        const fileContent = fs.readFileSync(path.join(pathJson, file), "utf-8")

        return JSON.parse(fileContent) as QuestionFile
    })

    return files
}