import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

import QuestionFile from "@/types/personality/QuestionFile"

export function getQuestions(name: string) {
    const __dirname = path.dirname(fileURLToPath(import.meta.url))
    const pathJson = path.join(__dirname, "..", "app", "routes", "personality", "questions", `${name}.json`)

    const hasFile = fs.existsSync(pathJson)
    if (!hasFile) return null

    const file = fs.readFileSync(pathJson, "utf-8")

    return JSON.parse(file) as QuestionFile
}