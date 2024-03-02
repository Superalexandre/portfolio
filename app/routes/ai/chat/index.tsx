import { useCallback, useEffect, useRef, useState } from "react"
import { MdSend } from "react-icons/md"
import Markdown from "react-markdown"
import type { Socket } from "socket.io-client"
import { io } from "socket.io-client"
import { v4 as uuid } from "uuid"

import AIMessage from "@/types/AIMessage"

export default function Index() {
    const [messages, setMessages] = useState<AIMessage[]>([])
    const [socket, setSocket] = useState<Socket>()
    const input = useRef<HTMLInputElement>(null)

    const sendMessage = (message: string) => {
        if (!socket || !message) return

        socket.emit("message", {
            id: uuid(),
            content: message,
            date: new Date(),
            author: "User"
        })
    }

    const addMessage = useCallback((message: AIMessage) => {
        setMessages(prevMessages => {
            const existingIndex = prevMessages.findIndex(msg => msg.id === message.id)

            if (existingIndex !== -1) {
                const newMessages = [...prevMessages]
                newMessages[existingIndex] = message
                return newMessages
            } else {
                return [...prevMessages, message]
            }
        })
    }, [setMessages])

    const handleMessage = () => {
        if (!input.current || input.current.value === "") return

        sendMessage(input.current.value)

        input.current.value = ""
    }

    useEffect(() => {
        const socketIo = io({
            path: "/api/ws"
        })

        setSocket(socketIo)

        socketIo.on("message", (message: AIMessage) => {
            console.log("Message received", message)

            addMessage(message)
        })

        return () => {
            socketIo.close()
        }
    }, [])

    if (!socket) return (
        <div>
            <p>Loading...</p>
        </div>
    )

    return (
        <div className="flex h-full min-h-screen min-w-full flex-col justify-between bg-slate-700">
            <div className="m-4 flex max-h-[85vh] min-h-[85vh] flex-col gap-4 overflow-auto rounded-lg border-2 border-slate-600">
                {messages.length === 0 ?
                    <div className="flex min-h-fit flex-col items-center justify-center">
                        <p className="text-center text-lg text-white">Aucun message</p>
                        <p className="text-center text-sm text-gray-400">Commencer a écrire !</p>
                    </div> :
                    <Messages messages={messages} />
                }
            </div>

            <div className="m-4 flex h-16 flex-row gap-4">
                <input
                    type="text"
                    id="prompt"
                    name="prompt"
                    placeholder="Entrez votre message"
                    className="h-full w-full rounded bg-slate-800 p-2 text-white"
                    ref={input}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") handleMessage()
                    }}
                />

                <button
                    onClick={handleMessage}
                    className="flex h-full w-32 flex-row items-center justify-center gap-2 rounded bg-green-500 p-2 text-white"
                >
                    <MdSend size={20} />

                    Envoyer
                </button>
            </div>

        </div>
    )
}

const Messages = ({ messages }: { messages: AIMessage[] }) => {
    const Loader = ({ className, classNameDot }: { className?: string, classNameDot?: string }) => {
        const classDot = `h-4 w-4 bg-white rounded-full animate-bounce ${classNameDot}`
        
        return (
            <div className={`flex w-auto items-center justify-center gap-2 ${className}`}>
                <span className='sr-only'>Loading...</span>
                <div className={`${classDot} [animation-delay:-0.3s]`}></div>
                <div className={`${classDot} [animation-delay:-0.15s]`}></div>
                <div className={`${classDot}`}></div>
            </div>
        )
    }

    const Thinking = () => {
        return (
            <div className="flex flex-row items-center gap-2">
                <Loader 
                    classNameDot="!bg-gray-400"
                />

                <p className="text-gray-400">Analyse en cours...</p>
            </div>
        )
    }

    return messages.map((message, index) => (
        <div
            className="flex flex-col p-2"
            key={index}
        >
            <p className={`${message.author === "User" ? "text-blue-500" : "text-purple-500"} font-bold`}>
                {message.author} :

                {message.time ? <span className="ml-2 text-sm text-gray-400">({message.time}ms)</span> : null}
            </p>

            {message.analyzing ?
                <Thinking /> :
                <Markdown
                    className="prose text-white"
                >
                    {message.content}
                </Markdown>
            }
        </div>
    ))

}