import fs from "fs"
import path from "path"

import QuestionFile from "@/types/personality/QuestionFile"

export function getPersonalities() {
    const pathJson = path.join("public", "questions")

    const files = fs.readdirSync(pathJson).map(file => {
        const fileContent = fs.readFileSync(path.join(pathJson, file), "utf-8")

        return JSON.parse(fileContent) as QuestionFile
    })

    return files
}