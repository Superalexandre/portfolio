import path from "path"
import { fileURLToPath } from "url"

import { input } from "@inquirer/prompts"
import chalk from "chalk"
import { LlamaModel, LlamaContext, LlamaChatSession, Token } from "node-llama-cpp"

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Mistral model : https://huggingface.co/TheBloke/CapybaraHermes-2.5-Mistral-7B-GGUF/tree/main
const modelPath = path.join(__dirname, "models", "capybarahermes-2.5-mistral-7b.Q4_K_M.gguf")

const model = new LlamaModel({
    modelPath: modelPath,
    vocabOnly: false
})

const context = new LlamaContext({ model })
const session = new LlamaChatSession({ context, promptWrapper: undefined })

async function main() {
    // eslint-disable-next-line no-constant-condition
    while (true) {
        const message = await input({
            message: "You :",
            theme: {
                prefix: undefined,
                style: {
                    message: chalk.cyan
                }
            }
        })

        if (message === "exit") break
        if (message === "clear") {
            console.clear()
            continue
        }

        if (message === "context") {
            console.log(session.context)
            continue
        }

        const signal = new AbortController()

        const startResponse = Date.now()
        await session.prompt(message, {
            signal: signal.signal,
            temperature: 0.8,
            onToken(chunk: Token[]) {
                process.stdout.write(context.decode(chunk))
            }
        })
        const endResponse = Date.now()

        const time = endResponse - startResponse
        const timeStr = time < 1000 ? `${time}ms` : `${(time / 1000).toFixed(2)}s`

        const color = (text: string) => time < 1000 ? chalk.green(text) : time < 2000 ? chalk.yellow(text) : chalk.red(text)

        console.log(`\n\nTemps : [${color(timeStr)}${chalk.reset()}]`)
    }
}

main()