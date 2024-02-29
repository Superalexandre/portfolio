import path from "path"
import { fileURLToPath } from "url"

import { LlamaModel, LlamaContext, LlamaChatSession, Token } from "node-llama-cpp"
import { Socket } from "socket.io"
import { DefaultEventsMap } from "socket.io/dist/typed-events"
import { v4 as uuid } from "uuid"

import AIMessage from "@/types/AIMessage"

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Mistral model : https://huggingface.co/TheBloke/CapybaraHermes-2.5-Mistral-7B-GGUF/tree/main
const modelPath = path.join(__dirname, "models", "capybarahermes-2.5-mistral-7b.Q4_K_M.gguf")

const model = new LlamaModel({
    modelPath: modelPath,
    vocabOnly: false
})

const context = new LlamaContext({ model })
const session = new LlamaChatSession({ context, promptWrapper: undefined })

type SocketParams = Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, unknown>

async function reply({ socket, message }: { socket: SocketParams, message: string }) {
    const signal = new AbortController()
    const id = uuid()
    
    socket.emit("message", {
        id: id,
        content: "",
        analyzing: true,
        date: new Date(),
        author: "AI"
    } satisfies AIMessage)

    const startResponse = Date.now()
    let cachedMessage = ""
    const rep = await session.prompt(message, {
        signal: signal.signal,
        temperature: 0.8,
        onToken(chunk: Token[]) {
            cachedMessage += context.decode(chunk)

            socket.emit("message", {
                id: id,
                content: cachedMessage,
                analyzing: false,
                date: new Date(),
                author: "AI",
            } satisfies AIMessage)
        }
    })
    const endResponse = Date.now()

    const time = endResponse - startResponse
    
    socket.emit("message", {
        id: id,
        content: rep,
        analyzing: false,
        date: new Date(),
        author: "AI",
        time: time,
    } satisfies AIMessage)

    return {
        signal,
        success: true
    }    
}

export default reply