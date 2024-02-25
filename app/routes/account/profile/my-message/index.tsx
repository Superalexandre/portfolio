import { ActionFunctionArgs, json, redirect } from "@remix-run/node"
import { useLoaderData } from "@remix-run/react"

import User from "types/User"
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
        <div className="flex flex-col justify-center items-center w-full" >
            <div className="flex flex-col items-center gap-4 m-4">
                <h1 className="text-2xl text-center text-white">
                    Liste de vos messages
                </h1>
            </div>

            <div className="flex flex-col justify-center items-center">
                {messages.map((message) => (
                    <div
                        key={message.id}
                        className="text-white text-center flex flex-row items-center justify-center gap-4"
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
                className="bg-green-500 hover:bg-green-700 text-white text-center font-bold py-2 px-4 rounded-lg my-4 lg:absolute lg:right-0 lg:bottom-0 lg:m-4 z-10"
            >
                Créer un message secret
            </a>
        </div>
    )
}