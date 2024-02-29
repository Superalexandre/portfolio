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
        <div className={`${displayMessage ? color.bg : "bg-slate-700"} min-w-full h-full min-h-screen flex justify-center items-center flex-col`}>
            <Form
                method="post"
                action={`/secretMessage/${data.id}`}
                fetcherKey="viewMessage"
            >
                <button
                    type="submit"
                    name="_action"
                    value="view"
                    className={`${displayMessage ? "hidden" : "block"} bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded`}
                >
                    Voir votre message secret
                </button>
            </Form>

            <div className={`${displayMessage ? "block" : "hidden"} min-w-full h-full min-h-screen flex justify-center items-center flex-col gap-8 lg:gap-0`}>
                <div className="w-11/12 lg:w-9/12 flex justify-center items-center flex-col z-10">
                    <div className={`w-11/12 lg:w-9/12 min-h-96 ${color.secondBg} rounded-lg flex justify-center items-center mt-4 border ${color.border}`}>
                        <p className={`${color.text} text-center m-4 break-all`}>{data.message}</p>
                    </div>
                    <p className={`w-11/12 lg:w-9/12 text-center lg:text-right ${color.text}`}>Écrit par {data.author} le {date}</p>

                    <Form
                        className={`${data.isQuestion ? "block" : "hidden"} flex flex-row gap-4 justify-center`}
                        method="post"
                        fetcherKey={"reply"}
                    >
                        <button 
                            type="submit" 
                            value="yes" 
                            name="_action" 
                            className="bg-green-500 hover:bg-green-700 text-white text-center font-bold py-2 px-4 rounded-lg mt-4"
                        >
                            Oui
                        </button>
                        <button 
                            type="submit" 
                            value="no" 
                            name="_action" 
                            className="bg-red-500 hover:bg-red-700 text-white text-center font-bold py-2 px-4 rounded-lg mt-4"
                        >
                            Non
                        </button>
                    </Form>
                </div>
                <a href="/secretMessage" className="bg-green-500 hover:bg-green-700 text-white text-center font-bold py-2 px-4 rounded-lg mb-4 lg:absolute lg:right-0 lg:bottom-0 lg:m-4 z-10">Créer un message secret</a>
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
        <div className="bg-slate-700 min-w-full h-full min-h-screen flex justify-center items-center flex-col gap-2">
            <h1 className="text-white text-center text-2xl">Message secret introuvable</h1>
            <a className="text-white hover:text-main-color underline" href="/secretMessage">Créer un message secret</a>
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
                className="-z-10 overflow-hidden !fixed"
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
                    className="absolute heart"
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
                    className="absolute rain"
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