import { useWindowSize } from "@react-hookz/web"
import { ActionFunctionArgs, MetaFunction } from "@remix-run/node"
import { Form, useActionData, useLoaderData } from "@remix-run/react"
import React from "react"
import Confetti from "react-confetti"

import { formatDate } from "~/utils/date"

import addView from "./addView"
import getMessage from "./getMessage"

export const meta: MetaFunction = () => {
    return [
        { title: "Voir votre message secret" },
        { name: "description", content: "Vous avez reçu un message secret" },
    ]
}

export async function loader({ params }: { params: { id: string } }) {
    const message = await getMessage(params.id)

    return message
}

export async function action({ request, params }: ActionFunctionArgs) {
    const body = await request.formData()
    const { ...values } = Object.fromEntries(body)

    if (!values._action || !params.id) return { 
        success: false,
        error: true,
        message: "Merci de choisir une action",
    }

    if (values._action === "view") {
        addView(params.id)

        return {
            success: true,
            error: false,
            message: "Message vu avec succès !",
        }
    } else {
        return {
            success: true,
            error: false,
            message: "Message vu avec succès !",
        }
    }
}

export default function Index() {
    const data = useLoaderData<typeof loader>()

    if (!data) return <NotFound />

    const result = useActionData<typeof action>()

    const date = formatDate(new Date(data.createdAt))
    const displayMessage = result?.success || false

    const colors: { [key: string]: { text: string, bg: string, border: string, secondBg: string } } = {
        dark: {
            text: "text-white",
            bg: "bg-slate-700",
            border: "border-slate-500",
            secondBg: "bg-slate-900"
        },
        white: {
            text: "text-black",
            bg: "bg-white",
            border: "border-black",
            secondBg: "bg-gray-200"
        },
        pink: {
            text: "text-white",
            bg: "bg-pink-900",
            border: "border-pink-500",
            secondBg: "bg-pink-600"
        }
    }

    const color = colors[data.backgroundColor]

    const Message = () => (
        <div className={`${displayMessage ? color.bg : "bg-slate-700"} flex h-full min-h-screen min-w-full flex-col items-center justify-center`}>
            <Form
                method="post"
                action={`/secretMessage/${data.id}`}
                fetcherKey="viewMessage"
            >
                <button
                    type="submit"
                    name="_action"
                    value="view"
                    className={`${displayMessage ? "hidden" : "block"} rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700`}
                >
                    Voir votre message secret
                </button>
            </Form>

            <div className={`${displayMessage ? "block" : "hidden"} flex h-full min-h-screen min-w-full flex-col items-center justify-center gap-8 lg:gap-0`}>
                <div className="z-10 flex w-11/12 flex-col items-center justify-center lg:w-9/12">
                    <div className={`min-h-96 w-11/12 lg:w-9/12 ${color.secondBg} mt-4 flex items-center justify-center rounded-lg border ${color.border}`}>
                        <p className={`${color.text} m-4 break-all text-center`}>{data.message}</p>
                    </div>
                    <p className={`w-11/12 text-center lg:w-9/12 lg:text-right ${color.text}`}>Écrit par {data.author} le {date}</p>

                    <Form
                        className={`${data.isQuestion ? "block" : "hidden"} flex flex-row justify-center gap-4`}
                        method="post"
                        fetcherKey={"reply"}
                    >
                        <button 
                            type="submit" 
                            value="yes" 
                            name="_action" 
                            className="mt-4 rounded-lg bg-green-500 px-4 py-2 text-center font-bold text-white hover:bg-green-700"
                        >
                            Oui
                        </button>
                        <button 
                            type="submit" 
                            value="no" 
                            name="_action" 
                            className="mt-4 rounded-lg bg-red-500 px-4 py-2 text-center font-bold text-white hover:bg-red-700"
                        >
                            Non
                        </button>
                    </Form>
                </div>
                <a href="/secretMessage" className="z-10 mb-4 rounded-lg bg-green-500 px-4 py-2 text-center font-bold text-white hover:bg-green-700 lg:absolute lg:bottom-0 lg:right-0 lg:m-4">Créer un message secret</a>
            </div>
        </div>
    )

    if (displayMessage && data.ambiance === "confetti") {
        return (
            <ConfettiComponent>
                <Message />
            </ConfettiComponent>
        )
    } else if (displayMessage && data.ambiance === "love") {
        return (
            <HeartComponent>
                <Message />
            </HeartComponent>
        )
    } else if (displayMessage && data.ambiance === "rain") {
        return (
            <RainComponent>
                <Message />
            </RainComponent>
        )
    }

    return <Message />
}

const NotFound = () => {
    return (
        <div className="flex h-full min-h-screen min-w-full flex-col items-center justify-center gap-2 bg-slate-700">
            <h1 className="text-center text-2xl text-white">Message secret introuvable</h1>
            <a className="text-white underline hover:text-main-color" href="/secretMessage">Créer un message secret</a>
        </div>
    )
}

const ConfettiComponent = ({ children }: { children: React.ReactNode }) => {
    const { width, height } = useWindowSize()

    return (
        <div>
            <Confetti
                width={width || 0}
                height={height || 0}
                className="!fixed -z-10 overflow-hidden"
            >
            </Confetti>

            {children}
        </div>
    )
}

const HeartComponent = ({ children, number = 50 }: { children: React.ReactNode, number?: number }) => {
    const hearts = generateElements(number)

    return (
        <div className="relative h-screen overflow-hidden">
            {hearts.map((heart) => (
                <div
                    key={heart.id}
                    className="heart absolute"
                    style={{
                        left: heart.style.left,
                        animationDuration: heart.style.animationDuration,
                        opacity: heart.style.opacity,
                    }}
                ></div>
            ))}

            {children}
        </div>
    )
}

const RainComponent = ({ children, number = 50 }: { children: React.ReactNode, number?: number }) => {
    const rains = generateElements(number)

    return (
        <div className="relative h-screen overflow-hidden">
            {rains.map((rain) => (
                <div
                    key={rain.id}
                    className="rain absolute"
                    style={{
                        left: rain.style.left,
                        animationDuration: rain.style.animationDuration,
                        opacity: rain.style.opacity,
                    }}
                ></div>
            ))}

            {children}
        </div>
    )
}

const generateElements = (number: number) => {
    const elements = Array.from({ length: number }, (_, index) => ({
        id: index,
        style: {
            left: `${Math.random() * 100}vw`,
            animationDuration: `${Math.random() * 2 + 1}s`,
            opacity: Math.random(),
        },
    }))

    return elements
}