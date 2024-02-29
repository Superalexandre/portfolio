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
        <div
            // flex justify-center items-center flex-col gap-4
            className="bg-slate-700 min-w-full h-full min-h-screen flex flex-col justify-between"
        >
            <div className="m-4 max-h-[85vh] min-h-[85vh] overflow-auto border-slate-600 border-2 rounded-lg flex flex-col gap-4">
                {messages.length === 0 ?
                    <div className="min-h-fit flex flex-col justify-center items-center">
                        <p className="text-white text-lg text-center">Aucun message</p>
                        <p className="text-gray-400 text-sm text-center">Commencer a écrire !</p>
                    </div> :
                    <Messages messages={messages} />
                }
            </div>

            <div className="h-16 gap-4 m-4 flex flex-row">
                <input
                    type="text"
                    id="prompt"
                    name="prompt"
                    placeholder="Entrez votre message"
                    className="bg-slate-800 text-white p-2 rounded w-full h-full"
                    ref={input}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") handleMessage()
                    }}
                />

                <button
                    onClick={handleMessage}
                    className="bg-green-500 text-white p-2 rounded flex flex-row items-center justify-center gap-2 w-32 h-full"
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
            <div className={`flex gap-2 items-center justify-center w-auto ${className}`}>
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
            className="p-2 flex flex-col"
            key={index}
        >
            <p className={`${message.author === "User" ? "text-blue-500" : "text-purple-500"} font-bold`}>
                {message.author} :

                {message.time ? <span className="text-gray-400 text-sm ml-2">({message.time}ms)</span> : null}
            </p>

            {message.analyzing ?
                <Thinking /> :
                <Markdown
                    className="text-white prose"
                >
                    {message.content}
                </Markdown>
            }
        </div>
    ))

}