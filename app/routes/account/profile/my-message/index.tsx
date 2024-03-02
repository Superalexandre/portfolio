import { ActionFunctionArgs, json, redirect } from "@remix-run/node"
import { useLoaderData } from "@remix-run/react"

import User from "@/types/User"
import { getUser } from "~/session.server"

import getMessages from "./getMessages"

export async function loader({ request }: ActionFunctionArgs) {
    const profile = await getUser(request)
    if (!profile) return redirect("/account/login")

    const messages = await getMessages(profile as User)

    return json({
        ...profile,
        ...messages
    })
}

export default function Index() {
    const { messages } = useLoaderData<typeof loader>()

    return (
        <div className="flex w-full flex-col items-center justify-center" >
            <div className="m-4 flex flex-col items-center gap-4">
                <h1 className="text-center text-2xl text-white">
                    Liste de vos messages
                </h1>
            </div>

            <div className="flex flex-col items-center justify-center">
                {messages.map((message) => (
                    <div
                        key={message.id}
                        className="flex flex-row items-center justify-center gap-4 text-center text-white"
                    >
                        <p>{message.id}</p>
                        <p>{message.author}</p>
                        <p>{message.views} vues</p>
                        <a href={`/secretMessage/${message.id}`}>
                            Voir le message
                        </a>
                    </div>
                ))}
            </div>

            
            <a 
                href="/secretMessage" 
                className="z-10 my-4 rounded-lg bg-green-500 px-4 py-2 text-center font-bold text-white hover:bg-green-700 lg:absolute lg:bottom-0 lg:right-0 lg:m-4"
            >
                Créer un message secret
            </a>
        </div>
    )
}