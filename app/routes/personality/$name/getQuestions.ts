import fs from "fs"
import path from "path"

import QuestionFile from "@/types/personality/QuestionFile"

export function getQuestions(name: string) {
    const pathJson = path.join("public", "questions", `${name}.json`)

    const hasFile = fs.existsSync(pathJson)
    if (!hasFile) return null

    const file = fs.readFileSync(pathJson, "utf-8")

    return JSON.parse(file) as QuestionFile
}