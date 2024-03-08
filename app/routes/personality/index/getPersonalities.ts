import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

export function getPersonalities() {

    const __dirname = path.dirname(fileURLToPath(import.meta.url))
    const pathJson = path.join(__dirname, "..", "app", "routes", "personality", "questions")

    const files = fs.readdirSync(pathJson)

    return files
}